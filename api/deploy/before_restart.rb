Chef::Log.info("Running before restart tasks")

user "root"

base_path = "/srv/www/kkv_nettineuvoja_api1"

execute "php #{base_path}/current/artisan doctrine:schema:update --sql"
execute "php #{base_path}/current/artisan doctrine:generate:proxies"

