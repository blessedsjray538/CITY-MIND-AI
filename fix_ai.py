content = open('backend/app/routes/ai.py', 'r', encoding='utf-8').read()

# Fix the undefined total_vehicles and avg_speed in the general fallback section
old_block = (
    '    # Cross-department / General reasoning\n'
    '    ans = (\n'
    '        f"### \U0001f9e0 CITYMIND Urban Systems Analysis\\n\\n"\n'
    '        f"Regarding your inquiry about **\'{q}\'**:\\n\\n"\n'
    '        f"CITYMIND AI monitors the Bhubaneswar corridor as an interconnected cyber-physical system:\\n"\n'
    '        f"1. **Mobility:** {total_vehicles} vehicles currently active at an average speed of {avg_speed} km/h.\\n"\n'
    '        f"2. **Atmosphere:** Stable coastal conditions with real-time Open-Meteo observation.\\n"\n'
    '        f"3. **Sanitation:** {len(pending_waste)} pending waste sites (RED) vs {len(cleaned_waste)} resolved sites (GREEN).\\n"\n'
    '        f"4. **Disaster Readiness:** Historical benchmarks calibrated against the 1999 Odisha Super Cyclone (260 km/h) and Cyclone Fani.\\n\\n"\n'
    '        f"Would you like me to simulate a specific urban scenario, close an artery for detour modeling, or run signal optimization?"\n'
    '    )'
)

new_block = (
    '    # Cross-department / General reasoning\n'
    '    _avg_speed = round(sum(r.get("avg_speed_kmh", 40) for r in ROAD_SEGMENTS.values()) / max(len(ROAD_SEGMENTS), 1), 1)\n'
    '    ans = (\n'
    '        f"### \U0001f9e0 CITYMIND Urban Systems Analysis\\n\\n"\n'
    '        f"Regarding your inquiry about **\'{q}\'**:\\n\\n"\n'
    '        f"CITYMIND AI monitors the Bhubaneswar corridor as an interconnected cyber-physical system:\\n"\n'
    '        f"1. **Mobility:** Corridor average speed is {_avg_speed} km/h across {len(ROAD_SEGMENTS)} monitored arterial roads.\\n"\n'
    '        f"2. **Atmosphere:** Stable coastal conditions with real-time Open-Meteo observation.\\n"\n'
    '        f"3. **Sanitation:** {len(pending_waste)} pending waste sites (RED) vs {len(cleaned_waste)} resolved sites (GREEN).\\n"\n'
    '        f"4. **Disaster Readiness:** Historical benchmarks calibrated against the 1999 Odisha Super Cyclone (260 km/h) and Cyclone Fani.\\n\\n"\n'
    '        f"Would you like me to simulate a specific urban scenario, close an artery for detour modeling, or run signal optimization?"\n'
    '    )'
)

if old_block in content:
    content = content.replace(old_block, new_block)
    open('backend/app/routes/ai.py', 'w', encoding='utf-8').write(content)
    print('SUCCESS: ai.py fixed')
else:
    print('NOT FOUND - checking actual content around line 186-196:')
    lines = content.split('\n')
    for i, l in enumerate(lines[184:198], start=185):
        print(i, repr(l))
