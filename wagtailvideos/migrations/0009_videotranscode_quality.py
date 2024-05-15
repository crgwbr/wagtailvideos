# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-08-01 04:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailvideos', '0008_auto_20160728_1523'),
    ]

    operations = [
        migrations.AddField(
            model_name='videotranscode',
            name='quality',
            field=models.CharField(
                choices=[
                    ("default", "Default"),
                    ("lowest", "Low"),
                    ("highest", "High"),
                ],
                default="default",
                max_length=7,
            ),
        ),
    ]
