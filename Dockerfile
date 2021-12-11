FROM python
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . /app
COPY start.sh /app/start.sh
WORKDIR /app
RUN chmod +x /app/start.sh
CMD ["/bin/sh", "/app/start.sh"]