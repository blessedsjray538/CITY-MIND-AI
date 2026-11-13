"""
CITYMIND Historical Disaster Archive & Fact-Checking Repository
Contains verified facts, meteorological benchmarks, and civil defense data
Sourced from:
- India Meteorological Department (IMD) Technical Reports
- Odisha State Disaster Management Authority (OSDMA) Official Archives
- Ministry of Home Affairs (MHA) National Disaster Management Records
"""

from typing import Dict, Any, List, Optional
import re

HISTORICAL_DISASTERS_ARCHIVE: List[Dict[str, Any]] = [
    {
        "id": "cyclone_1999_super",
        "name": "1999 Odisha Super Cyclone (BOB 06 / 05B)",
        "year": 1999,
        "exact_dates": "25 October – 4 November 1999 (Landfall: 29 October 1999, ~10:30 AM IST)",
        "type": "Super Cyclonic Storm (Category 5 Equivalent)",
        "category": "Super Cyclone",
        "max_wind_kmh": 260.0,
        "wind_gusts_kmh": 300.0,
        "lowest_pressure_hpa": 912.0,
        "storm_surge_m": "6 to 7 meters (up to 23 feet inundating up to 35 km inland)",
        "landfall_location": "Between Paradip and Ersama, Jagatsinghpur District, Odisha",
        "affected_areas": "14 coastal districts: Jagatsinghpur, Kendrapara, Cuttack, Khordha (including Bhubaneswar capital metro), Puri, Jajpur, Bhadrak, and Balasore",
        "official_casualties": "9,887 human deaths (Jagatsinghpur alone recorded 8,119 casualties); over 440,000 livestock perished",
        "bhubaneswar_impact": (
            "Complete devastation of urban electrical grids and telecommunications. "
            "Over 85% of tree cover in Bhubaneswar was uprooted. The NH-16 (then NH-5) corridor "
            "between Jaydev Vihar, Acharya Vihar, and Rasulgarh was blocked for days by giant debris, "
            "severing emergency aid. Power was not restored to parts of Bhubaneswar for over 3 weeks."
        ),
        "damage_description": (
            "Over 1.65 million houses destroyed or severely damaged, 13 million people affected. "
            "Saline water inundated hundreds of thousands of hectares of fertile farmland, wiping out the paddy crop."
        ),
        "lessons_learned": (
            "Directly catalyzed the creation of the Odisha State Disaster Management Authority (OSDMA) in late 1999—"
            "making Odisha the first state in India to establish a dedicated disaster mitigation agency. It also paved the way "
            "for the National Disaster Management Act of 2005, coastal multi-purpose cyclone shelters, and the world-recognized 'Zero Casualty Mission'."
        ),
        "sources": [
            "IMD Technical Monograph (1999 Super Cyclone Post-Disaster Analysis)",
            "OSDMA Monograph & White Paper on Disaster Risk Reduction",
            "WMO Tropical Cyclone Programme Report"
        ]
    },
    {
        "id": "cyclone_2013_phailin",
        "name": "Very Severe Cyclonic Storm Phailin (BOB 04)",
        "year": 2013,
        "exact_dates": "8 October – 14 October 2013 (Landfall: 12 October 2013, ~9:00 PM IST)",
        "type": "Very Severe Cyclonic Storm (Category 5 peak in Bay of Bengal, landed as high Cat 4)",
        "category": "Very Severe Cyclone",
        "max_wind_kmh": 215.0,
        "wind_gusts_kmh": 240.0,
        "lowest_pressure_hpa": 940.0,
        "storm_surge_m": "3.5 meters",
        "landfall_location": "Near Gopalpur, Ganjam District, Odisha",
        "affected_areas": "Ganjam, Puri, Khordha (Bhubaneswar), Cuttack, Gajapati, and Balasore",
        "official_casualties": "44 fatalities (drastically curtailed due to prompt evacuations)",
        "bhubaneswar_impact": (
            "Heavy gale-force winds of 100-130 km/h swept Bhubaneswar. Urban flooding along low-lying "
            "culverts in Jaydev Vihar and Nayapalli underpasses. Power infrastructure sustained localized damage, "
            "restored within 4 to 5 days thanks to pre-positioned rapid response squads."
        ),
        "damage_description": (
            "Over 1.15 million people were successfully evacuated by OSDMA, NDRF, and ODRAF within 48 hours—"
            "hailed internationally by the United Nations as a global milestone in disaster preparedness. Extensive paddy field damage."
        ),
        "lessons_learned": (
            "Validated early warning sirens, public broadcast protocols, and pre-positioning of heavy clearing equipment along NH-16."
        ),
        "sources": [
            "IMD Post-Storm Report on Cyclone Phailin (2013)",
            "OSDMA Disaster Documentation Series"
        ]
    },
    {
        "id": "cyclone_2014_hudhud",
        "name": "Extremely Severe Cyclonic Storm Hudhud",
        "year": 2014,
        "exact_dates": "7 October – 14 October 2014 (Landfall: 12 October 2014)",
        "type": "Extremely Severe Cyclonic Storm (Category 4 Equivalent)",
        "category": "Extremely Severe Cyclone",
        "max_wind_kmh": 185.0,
        "wind_gusts_kmh": 210.0,
        "lowest_pressure_hpa": 950.0,
        "storm_surge_m": "2.0 meters",
        "landfall_location": "Near Visakhapatnam, Andhra Pradesh (severe impact on Southern Odisha)",
        "affected_areas": "Koraput, Malkangiri, Rayagada, Gajapati, Ganjam, and southern Khordha",
        "official_casualties": "61 total (Odisha recorded 2 direct deaths)",
        "bhubaneswar_impact": (
            "Heavy downpours and peripheral outer rainbands caused severe waterlogging in Bhubaneswar "
            "and swelling of the Daya and Kuakhai river systems."
        ),
        "damage_description": "Massive damage to communication lines and agricultural crops in southern tribal districts of Odisha.",
        "lessons_learned": "Showed importance of tracking post-landfall rainbands that penetrate deep into interior plateau districts.",
        "sources": ["IMD Cyclone Hudhud Monograph", "NDMA Post-Disaster Audit"]
    },
    {
        "id": "cyclone_2019_fani",
        "name": "Extremely Severe Cyclonic Storm Fani",
        "year": 2019,
        "exact_dates": "26 April – 5 May 2019 (Landfall: 3 May 2019, ~8:00 AM IST)",
        "type": "Extremely Severe Cyclonic Storm (Category 4 Equivalent)",
        "category": "Extremely Severe Cyclone",
        "max_wind_kmh": 215.0,
        "wind_gusts_kmh": 250.0,
        "lowest_pressure_hpa": 932.0,
        "storm_surge_m": "1.5 to 2.5 meters",
        "landfall_location": "Puri coast, Odisha (~60 km south of Bhubaneswar)",
        "affected_areas": "Puri, Khordha (Bhubaneswar Metro), Cuttack, Jagatsinghpur, Kendrapara",
        "official_casualties": "64 fatalities (massive pre-emptive evacuation of 1.4 million residents in 24 hours saved tens of thousands of lives)",
        "bhubaneswar_impact": (
            "The eastern eyewall passed directly over Bhubaneswar Smart City with 180-205 km/h sustained winds. "
            "Total collapse of the 132/33 kV electrical transmission grids, AIIMS Bhubaneswar roof damage, "
            "tens of thousands of uprooted mature trees blocking the Jaydev Vihar – Vani Vihar corridor, "
            "and crushing of rooftop water tanks and mobile cell towers. Recovery took over 2 weeks of manual corridor clearance."
        ),
        "damage_description": (
            "Economic loss estimated at over ₹24,000 Crore (~$3.4 Billion USD). Millions left without running water and electricity. "
            "Over 500,000 houses damaged."
        ),
        "lessons_learned": (
            "Demonstrated the urgent mandate for underground power cabling across smart cities like Bhubaneswar, "
            "disaster-resilient telecom masts, and smart digital twins with automated route rerouting for relief vehicles."
        ),
        "sources": [
            "OSDMA Comprehensive Report on Cyclone FANI (2019)",
            "World Bank Global Facility for Disaster Reduction and Recovery (GFDRR) Assessment"
        ]
    },
    {
        "id": "cyclone_2020_amphan",
        "name": "Super Cyclonic Storm Amphan",
        "year": 2020,
        "exact_dates": "16 May – 21 May 2020 (Landfall: 20 May 2020)",
        "type": "Super Cyclonic Storm (Bay of Bengal's first Super Cyclone since 1999)",
        "category": "Super Cyclone",
        "max_wind_kmh": 260.0,
        "lowest_pressure_hpa": 907.0,
        "storm_surge_m": "4.5 to 5.5 meters",
        "landfall_location": "Bakkhali, West Bengal (skirted coastal Odisha)",
        "affected_areas": "Coastal Odisha (Kendrapara, Jagatsinghpur, Bhadrak, Balasore) & West Bengal Sundarbans",
        "official_casualties": "128 total (Odisha recorded 4 due to tree falls; major devastation in Bengal)",
        "bhubaneswar_impact": "Heavy squalls of 60-80 km/h, intense outer spiral band rain, and precautionary power shutdowns.",
        "damage_description": "Extensive damage to betel vines and standing crops in north coastal Odisha.",
        "lessons_learned": "Managing massive evacuation during the height of the COVID-19 pandemic with decentralized quarantine-friendly shelter protocols.",
        "sources": ["IMD RSMC New Delhi Bulletin", "OSDMA COVID-19 & Amphan Joint Protocol"]
    },
    {
        "id": "cyclone_2021_yaas",
        "name": "Very Severe Cyclonic Storm Yaas",
        "year": 2021,
        "exact_dates": "23 May – 28 May 2021 (Landfall: 26 May 2021)",
        "type": "Very Severe Cyclonic Storm",
        "category": "Very Severe Cyclone",
        "max_wind_kmh": 140.0,
        "lowest_pressure_hpa": 970.0,
        "storm_surge_m": "2.0 to 4.0 meters",
        "landfall_location": "South of Balasore, near Bahanaga coast, Odisha",
        "affected_areas": "Balasore, Bhadrak, Mayurbhanj, Kendrapara",
        "official_casualties": "20 total (4 in Odisha)",
        "bhubaneswar_impact": "Continuous moderate rain, isolated waterlogging at Vani Vihar underpass, wind gusts ~55 km/h.",
        "damage_description": "Severe saltwater inundation in low-lying coastal villages in Bhadrak and Balasore.",
        "lessons_learned": "Reinforced the need for permanent saline embankments with stone revetment along tidal rivers.",
        "sources": ["IMD Cyclone Yaas Summary", "Odisha Revenue & Disaster Management Dept."]
    }
]

def search_disaster_knowledge(query: str) -> Optional[Dict[str, Any]]:
    """
    Search verified disaster archive for matching disaster facts by year, name, or keywords.
    """
    q = query.lower()
    
    # 1. Year based match
    years = re.findall(r'\b(19\d\d|20\d\d)\b', q)
    for y in years:
        y_int = int(y)
        for d in HISTORICAL_DISASTERS_ARCHIVE:
            if d["year"] == y_int:
                return d
                
    # 2. Named cyclones
    keywords_map = {
        "super cyclone": "cyclone_1999_super",
        "supercyclone": "cyclone_1999_super",
        "1999": "cyclone_1999_super",
        "paradip cyclone": "cyclone_1999_super",
        "ersama": "cyclone_1999_super",
        "phailin": "cyclone_2013_phailin",
        "hudhud": "cyclone_2014_hudhud",
        "fani": "cyclone_2019_fani",
        "amphan": "cyclone_2020_amphan",
        "yaas": "cyclone_2021_yaas",
    }
    
    for kw, target_id in keywords_map.items():
        if kw in q:
            for d in HISTORICAL_DISASTERS_ARCHIVE:
                if d["id"] == target_id:
                    return d
                    
    # 3. Check general disaster terms
    if any(k in q for k in ["disaster", "cyclone", "storm", "hurricane", "history", "casualties"]):
        # Default to the most significant historical baseline: 1999 Super Cyclone
        return HISTORICAL_DISASTERS_ARCHIVE[0]
        
    return None

def format_disaster_fact_sheet(disaster: Dict[str, Any]) -> str:
    """
    Generates a high-trust, structured historical fact report.
    """
    return (
        f"### 🌪️ {disaster['name']}\n\n"
        f"> **Official Classification:** `{disaster['type']}`\n"
        f"> **Verified Source:** {', '.join(disaster['sources'])}\n\n"
        f"#### 📊 Meteorological Parameters\n"
        f"- **Landfall Date & Time:** {disaster['exact_dates']}\n"
        f"- **Landfall Point:** {disaster['landfall_location']}\n"
        f"- **Peak 3-Min Sustained Wind:** **{disaster['max_wind_kmh']} km/h** (Gusts up to {disaster.get('wind_gusts_kmh', 'N/A')} km/h)\n"
        f"- **Lowest Central Barometric Pressure:** **{disaster['lowest_pressure_hpa']} hPa**\n"
        f"- **Storm Surge Height:** {disaster['storm_surge_m']}\n\n"
        f"#### 📍 Affected Regions & Casualties\n"
        f"- **Affected Districts:** {disaster['affected_areas']}\n"
        f"- **Official Human Toll:** **{disaster['official_casualties']}**\n"
        f"- **Total Impact:** {disaster['damage_description']}\n\n"
        f"#### 🏛️ Impact on Bhubaneswar & NH-16 Corridor\n"
        f"{disaster['bhubaneswar_impact']}\n\n"
        f"#### 🛡️ Civic & Institutional Legacy\n"
        f"{disaster['lessons_learned']}"
    )
