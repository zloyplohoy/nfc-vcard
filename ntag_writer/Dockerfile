FROM python:3.8

ADD app /app

RUN pip install -r /app/requirements.txt

WORKDIR /app

CMD ["python3", "app.py"]
