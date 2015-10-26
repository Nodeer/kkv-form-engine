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

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # config.vm.network "forwarded_port", guest: 80, host: 8080

  config.vm.network "forwarded_port", guest: 8006, host: 8040

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  # config.vm.network "private_network", ip: "192.168.33.10"

  config.vm.network "private_network", ip: "192.168.50.50"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.

  config.vm.synced_folder "./api", "/app/api"
  config.vm.synced_folder "./ops/fpm-pools", "/etc/php5/fpm/pool.d"
  config.vm.synced_folder "./ops/nginx-sites", "/etc/nginx/sites-enabled"
  config.vm.provision "shell", inline: "sudo service nginx restart", run: "always"
  config.vm.provision "shell", inline: "sudo service php5-fpm restart", run: "always"

  config.vm.synced_folder "./storage", "/app/storage", {
      :mount_options => ['dmode=777','fmode=777'],
      :owner => "www-data", :group => "www-data"
    }

    config.vm.provider "virtualbox" do |vb|
      vb.name = "kkv-form-engine"
    end
end
