# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

ENV['VAGRANT_DEFAULT_PROVIDER'] = 'virtualbox'

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  # Every Vagrant development environment requires a box. You can search for
  # boxes at https://atlas.hashicorp.com/search.
  config.vm.box = "nordsoftware/nginx-php-mariadb-nodejs"

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.

  config.vm.network "private_network", ip: "192.168.90.90"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.

  config.vm.synced_folder "./admin-ui", "/app/admin-ui"
  config.vm.synced_folder "./api", "/app/api"
  config.vm.synced_folder "./consumer-ui", "/app/consumer-ui"
  config.vm.synced_folder "./ops/fpm-pools", "/etc/php5/fpm/pool.d"
  config.vm.synced_folder "./ops/nginx-sites", "/etc/nginx/sites-enabled"
  config.vm.provision "shell", inline: "sudo service nginx restart", run: "always"
  config.vm.provision "shell", inline: "sudo service php5-fpm restart", run: "always"

  # Copy over default configs to ${HOME}
  config.vm.provision "shell", inline: "cp /vagrant/config/.bashrc /home/vagrant/.bashrc", run: "always"
  config.vm.provision "shell", inline: "cp /vagrant/config/.vimrc /home/vagrant/.vimrc", run: "always"
  config.vm.provision "shell", inline: "cp /vagrant/config/.tmux.conf /home/vagrant/.tmux.conf", run: "always"
  config.vm.provision "shell", inline: "cp -R /vagrant/config/.tmux /home/vagrant/.tmux", run: "always"
  config.vm.provision "shell", inline: "chmod +x /home/vagrant/.tmux/zoom", run: "always"

  config.vm.synced_folder "./storage", "/app/storage", {
      :mount_options => ['dmode=777','fmode=777'],
      :owner => "www-data", :group => "www-data"
  }

  config.vm.provider "virtualbox" do |vb|
      vb.name = "kkv-form-engine"
  end
end
