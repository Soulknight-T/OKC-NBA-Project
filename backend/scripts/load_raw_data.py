import os
import sys
import django
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)
sys.path.insert(0, PROJECT_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")
django.setup()

from app.models import Team, Game, Player, Shot, Pass, Turnover

with open(os.path.join(BASE_DIR, ".." ,"raw_data", "teams.json"), "r") as f:
    teams_data = json.load(f)
for team in teams_data:
    Team.objects.update_or_create(
        team_id=team["team_id"],
        defaults={"name": team["name"]}
    )

# Load Games
with open(os.path.join(BASE_DIR, "..", "raw_data","games.json"), "r") as f:
    games_data = json.load(f)
for game in games_data:
    Game.objects.update_or_create(
        game_id=game["id"],
        defaults={"date": game["date"]}
    )

# Load Players and related Shots, Passes, Turnovers
with open(os.path.join(BASE_DIR, "..","raw_data", "players.json"), "r") as f:
    players_data = json.load(f)
for player_data in players_data:
    player, _ = Player.objects.update_or_create(
        player_id=player_data["player_id"],
        defaults={
            "name": player_data["name"],
            "team": Team.objects.get(team_id=player_data["team_id"])
        }
    )

    for shot in player_data.get("shots", []):
        Shot.objects.update_or_create(
            shot_id=shot["id"],
            defaults={
                "player": player,
                "game": Game.objects.get(game_id=shot["game_id"]),
                "points": shot["points"],
                "shooting_foul_drawn": shot["shooting_foul_drawn"],
                "shot_loc_x": shot["shot_loc_x"],
                "shot_loc_y": shot["shot_loc_y"],
                "action_type": shot["action_type"]
            }
        )

    for p in player_data.get("passes", []):
        Pass.objects.update_or_create(
            pass_id=p["id"],
            defaults={
                "player": player,
                "game": Game.objects.get(game_id=p["game_id"]),
                "completed_pass": p["completed_pass"],
                "potential_assist": p["potential_assist"],
                "turnover": p["turnover"],
                "ball_start_loc_x": p["ball_start_loc_x"],
                "ball_start_loc_y": p["ball_start_loc_y"],
                "ball_end_loc_x": p["ball_end_loc_x"],
                "ball_end_loc_y": p["ball_end_loc_y"],
                "action_type": p["action_type"]
            }
        )

    for t in player_data.get("turnovers", []):
        Turnover.objects.update_or_create(
            turnover_id=t["id"],
            defaults={
                "player": player,
                "game": Game.objects.get(game_id=t["game_id"]),
                "tov_loc_x": t["tov_loc_x"],
                "tov_loc_y": t["tov_loc_y"],
                "action_type": t["action_type"]
            }
        )

print("Data loaded successfully!")
