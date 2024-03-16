fetchCurrentWeather(code)

fonction qui retourne les prevision pour la journée actuelle

le code est le code pour la station choisie

FAIRE ATTENTION le code ne vont pas etre les même que pour la premiere station. 

Il y a des code special qui se trouve dans le JSON station_mapping.json ou le code est la chain de charactère avant .xml dans la chaine de charactere qui correspond a "rss_feed: du JSON

par exemple pour 50430 ou 2205 le code associé est ab-52_f

fetchClimateDay(stationId, year, month, day)

Retourne prévision pour la sation choisie durant le jour choisi (for some reason renvoie le moi au complet meme avec le lien exemple du prof)

ici le stationid reste le meme et il faut rentrer les moi et jour sous format : XX et l'année sous format XXXX