python version 3.10

PostgresDB Config at: fastApiProject/BirbBerry/utils/config.py

pip install poetry

poetry install

alembic upgrade head

alembic revision --autogenerate


after start OPENAPI: http://127.0.0.1:8000/#/