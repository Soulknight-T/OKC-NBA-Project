# -*- coding: utf-8 -*-
from app.dbmodels.models import *

class Team(models.Model):
    team_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)

class Game(models.Model):
    game_id = models.IntegerField(primary_key=True)
    date = models.DateField()

class Player(models.Model):
    player_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)

class Shot(models.Model):
    shot_id = models.IntegerField(primary_key=True)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    points = models.IntegerField()
    shooting_foul_drawn = models.BooleanField()
    shot_loc_x = models.FloatField()
    shot_loc_y = models.FloatField()
    action_type = models.CharField(max_length=50)

class Pass(models.Model):
    pass_id = models.IntegerField(primary_key=True)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    completed_pass = models.BooleanField()
    potential_assist = models.BooleanField()
    turnover = models.BooleanField()
    ball_start_loc_x = models.FloatField()
    ball_start_loc_y = models.FloatField()
    ball_end_loc_x = models.FloatField()
    ball_end_loc_y = models.FloatField()
    action_type = models.CharField(max_length=50)

class Turnover(models.Model):
    turnover_id = models.IntegerField(primary_key=True)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    tov_loc_x = models.FloatField()
    tov_loc_y = models.FloatField()
    action_type = models.CharField(max_length=50)