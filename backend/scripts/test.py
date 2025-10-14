import os
import sys
import django
import json

# 配置 Django 环境
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BASE_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

django.setup()

from app.models import Player
from app.helpers.players import get_player_summary_stats, get_ranks

def test_all_players():
    players = Player.objects.all()
    results = []

    for player in players:
        summary = get_player_summary_stats(player.player_id)
        ranks = get_ranks(player.player_id, summary)
        full_summary = summary | ranks
        results.append(full_summary)

    # 打印前 5 个球员结果
    for player_summary in results[:5]:
        print(json.dumps(player_summary, indent=2))

    # 保存所有球员结果到 JSON 文件
    output_file = os.path.join(BASE_DIR, "player_summary_test_output.json")
    with open(output_file, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\nAll player summaries saved to {output_file}")


if __name__ == "__main__":
    test_all_players()
