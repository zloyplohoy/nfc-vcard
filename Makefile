# Install the application
install: install-ansible


# Install the application using Ansible installation logic
install-ansible: install-ansible-venv install-ansible-pip install-ansible-playbook


# Create a Python virtual environment for Ansible installation logic
install-ansible-venv:
	@echo "Setting up virtual environment..."
	@python3 -m venv install/ansible/venv


# Install requirements for Ansible installation logic
install-ansible-pip:
	@echo "Installing Ansible..."
	@. install/ansible/venv/bin/activate && \
		pip install --disable-pip-version-check --quiet --requirement ./install/ansible/requirements.txt


# Run the Ansible installation logic playbook
install-ansible-playbook:
	@echo "Running installation playbook..."
	@. install/ansible/venv/bin/activate; \
		ansible-playbook --connection local --inventory localhost, install/ansible/install.yml


# Run tests on the repository
test: test-install


# Test the installation logic
test-install: test-install-ansible


# Test Ansible installation logic
test-install-ansible: test-install-ansible-venv test-install-ansible-pip test-install-ansible-lint


# Create a Python virtual environment for Ansible installation logic tests
test-install-ansible-venv:
	@python3 -m venv install/ansible/venv-test


# Install requirements for Ansible installation logic tests
test-install-ansible-pip:
	@. install/ansible/venv-test/bin/activate && \
		pip install --disable-pip-version-check --quiet --requirement install/ansible/requirements-test.txt


# Run Ansible Lint over Ansible installation logic
test-install-ansible-lint:
	@. install/ansible/venv-test/bin/activate && \
		ansible-lint install/ansible/install.yml
