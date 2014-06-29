# config/deploy.rb

# probably a lot of ways to improve this...
set :application, 'partyboard'
set :repo_url, 'git@github.com:frank611/partyboard.git'
# should set up a deploy user
set :user, 'deploy'

set :deploy_to, '/var/www/partyboard'
set :scm, :git

set :format, :pretty
set :log_level, :debug
set :pty, true

set :keep_releases, 5

namespace :deploy do

  #TODO: Add stop task in upstart
  desc "Stop Forever"
  task :started do
    on roles(:app) do
      execute "forever stopall", raise_on_non_zero_exit: false
    end
  end

  desc "Install node modules non-globally"
  task :npm_install do
    on roles(:app) do
      execute "cd #{current_path} && npm install"
    end
  end

  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      # This assumes you are using upstart to startup your application
      # - be sure that your upstart script runs as the 'deploy' user
      execute "sudo start node-upstart-script", raise_on_non_zero_exit: false
    end
  end

  before :restart, 'deploy:npm_install'

end