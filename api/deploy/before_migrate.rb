Chef::Log.info("Running before migrate tasks")

user "root"

# Enable mcrypt to get rid of the Undefined Constant issue.
execute "php5enmod mcrypt"

base_path = "/srv/www/kkv_nettineuvoja_api1"

storage_path = base_path + "/shared/storage"

paths = [
    "/app",
    "/framework/cache",
    "/framework/session",
    "/framework/views",
    "/logs"
]

paths.each do |path|
    create_path = storage_path + path;
    execute "mkdir -p #{create_path}"
end

execute "chown -R deploy:www-data #{storage_path}"
execute "chmod o+rx #{base_path}/shared"
execute "chmod -R 777 #{storage_path}"
