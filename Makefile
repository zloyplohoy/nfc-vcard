install: venv requirements ansible

venv:
	python3 -m venv venv

requirements:
	. ./venv/bin/activate && \
	pip3 install -r requirements.txt

ansible:
	. ./venv/bin/activate && \
	ansible-playbook -i inventory.txt playbook.yml
