#!/usr/bin/env python3
import json
import re

def check_korean_names():
    # Read the Korean file
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams.json', 'r', encoding='utf-8') as f:
        korean_data = json.load(f)

    # Read the English file for comparison
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en.json', 'r', encoding='utf-8') as f:
        english_data = json.load(f)

    print("=== CHECKING NAMES IN USER PROFILES ===")

    korean_pattern = re.compile(r'[가-힣]')

    for i, team in enumerate(korean_data):
        korean_team = team
        english_team = english_data[i] if i < len(english_data) else {}

        # Check owner info
        if 'owner_info' in korean_team and 'name' in korean_team['owner_info']:
            korean_name = korean_team['owner_info']['name']
            english_name = english_team.get('owner_info', {}).get('name', 'Missing')

            if korean_pattern.search(korean_name):
                print(f"Team {i+1} Owner:")
                print(f"  Korean:  {korean_name}")
                print(f"  English: {english_name}")
                print(f"  Still Korean: {korean_pattern.search(english_name) is not None}")
                print()

        # Check team_info members for names
        if 'team_info' in korean_team and 'members' in korean_team['team_info']:
            try:
                members_str = korean_team['team_info']['members']
                if isinstance(members_str, str):
                    # Parse the JSON string
                    import ast
                    members = eval(members_str)  # Note: eval is risky, but for analysis it's ok

                    for j, member in enumerate(members):
                        if 'userProfile' in member and 'name' in member['userProfile']:
                            korean_name = member['userProfile']['name']

                            # Get corresponding English member
                            english_members_str = english_team.get('team_info', {}).get('members', '[]')
                            english_members = eval(english_members_str) if isinstance(english_members_str, str) else []
                            english_name = english_members[j]['userProfile']['name'] if j < len(english_members) and 'userProfile' in english_members[j] else 'Missing'

                            if korean_pattern.search(korean_name):
                                print(f"Team {i+1} Member {j+1}:")
                                print(f"  Korean:  {korean_name}")
                                print(f"  English: {english_name}")
                                print(f"  Still Korean: {korean_pattern.search(english_name) is not None}")
                                print()

            except:
                pass

        # Only check first 6 teams for now
        if i >= 5:
            break

if __name__ == "__main__":
    check_korean_names()