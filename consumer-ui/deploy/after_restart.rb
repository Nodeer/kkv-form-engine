Chef::Log.info("Running after restart tasks")

user "root"

base_path = "/srv/www/kkv_nettineuvoja_consumer_ui1"
nginx_config_name = "kkv_nettineuvoja_consumer_ui1"
nginx_config_symlink = "kkv_nettineuvoja_consumer_ui1"

Chef::Log.info("Removing nginx site file")
execute "rm -f /etc/nginx/sites-enabled/#{nginx_config_symlink}"

Chef::Log.info("Symlinking nginx site file")
execute "ln -s #{base_path}/current/deploy/nginx/#{nginx_config_name} /etc/nginx/sites-enabled/#{nginx_config_symlink}"

Chef::Log.info("Reloading nginx configuration")
execute "service nginx reload"
