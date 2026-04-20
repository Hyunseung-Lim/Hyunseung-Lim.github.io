#!/usr/bin/env python3
import json
import re

def find_korean_content():
    # Read the English file to check if there's still Korean content
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en.json', 'r', encoding='utf-8') as f:
        english_data = json.load(f)

    korean_pattern = re.compile(r'[가-힣]')
    found_korean = []

    def search_korean(data, path=""):
        if isinstance(data, dict):
            for key, value in data.items():
                current_path = f"{path}.{key}" if path else key
                search_korean(value, current_path)
        elif isinstance(data, list):
            for i, item in enumerate(data):
                current_path = f"{path}[{i}]"
                search_korean(item, current_path)
        elif isinstance(data, str):
            if korean_pattern.search(data):
                found_korean.append({
                    'path': path,
                    'content': data[:200] + '...' if len(data) > 200 else data
                })

    # Search through all teams
    for i, team in enumerate(english_data):
        search_korean(team, f"Team{i+1}")

    print(f"=== FOUND {len(found_korean)} KOREAN TEXT SECTIONS IN ENGLISH FILE ===")
    for item in found_korean[:20]:  # Show first 20
        print(f"Path: {item['path']}")
        print(f"Content: {item['content']}")
        print("-" * 50)

if __name__ == "__main__":
    find_korean_content()