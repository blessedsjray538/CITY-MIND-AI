import os, itertools, httpx
from typing import List, Optional
from pathlib import Path
from dotenv import load_dotenv

# Ensure .env is loaded from backend directory or project root
load_dotenv()
_backend_env = Path(__file__).resolve().parent.parent.parent / ".env"
if _backend_env.exists():
    load_dotenv(dotenv_path=_backend_env)

class GeminiClient:
    def __init__(self):
        # Comma‑separated list of keys in GEMINI_API_KEYS
        keys_str = os.getenv("GEMINI_API_KEYS", "")
        self.keys: List[str] = [k.strip() for k in keys_str.split(",") if k.strip()]
        self.model: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
        self._key_cycle = itertools.cycle(self.keys) if self.keys else None  # round‑robin fail‑over

    async def generate(self, system: str, user: str) -> Optional[str]:
        """Call Gemini, rotating through configured keys on error.
        Returns ``None`` if no key succeeds.
        """
        if not self.keys or not self._key_cycle:
            return None

        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": user}]},
            ],
            "generationConfig": {"temperature": 0.4, "maxOutputTokens": 800},
        }
        if system and system.strip():
            sys_text = f"You are the central CITYMIND AI Intelligence assistant for the smart city digital twin platform of Bhubaneswar, Odisha. Department / Context: {system.strip()}."
            payload["system_instruction"] = {
                "parts": [{"text": sys_text}]
            }
        else:
            payload["system_instruction"] = {
                "parts": [{"text": "You are the central CITYMIND AI Intelligence assistant for the smart city digital twin platform of Bhubaneswar, Odisha."}]
            }

        for _ in range(len(self.keys)):
            key = next(self._key_cycle)
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model}:generateContent?key={key}"
            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    # Extract the first text response
                    return data["candidates"][0]["content"]["parts"][0]["text"].strip()
                # If we hit a quota, auth error, or server error, try next key
                if resp.status_code in {400, 403, 404, 429, 500, 503}:
                    continue
            except httpx.RequestError:
                continue
        return None

