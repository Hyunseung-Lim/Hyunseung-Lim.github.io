#!/usr/bin/env python3
import json
import re

def analyze_korean_content():
    # Read the Korean file
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams.json', 'r', encoding='utf-8') as f:
        korean_data = json.load(f)

    # Read the English file for comparison
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en.json', 'r', encoding='utf-8') as f:
        english_data = json.load(f)

    print(f"Korean data has {len(korean_data)} teams")
    print(f"English data has {len(english_data)} teams")

    # Check team topics
    print("\n=== TEAM TOPICS ===")
    for i, team in enumerate(korean_data):
        if 'team_info' in team and 'topic' in team['team_info']:
            korean_topic = team['team_info']['topic']
            english_topic = english_data[i]['team_info']['topic'] if i < len(english_data) and 'team_info' in english_data[i] and 'topic' in english_data[i]['team_info'] else "Missing"

            print(f"Team {i+1}:")
            print(f"  Korean:  {korean_topic}")
            print(f"  English: {english_topic}")
            print(f"  Match: {korean_topic == english_topic}")
            print()

            if i >= 5:  # Just show first 6 teams
                break

if __name__ == "__main__":
    analyze_korean_content()