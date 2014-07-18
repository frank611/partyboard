# config/deploy/production.rb
set :stage, :production

server 'new.frankthedev.com', user: 'deploy', roles: %w{web app}

server 'new.frankthedev.com',
  user: 'deploy',
  roles: %w{web app},
  ssh_options: {
#    user: 'user_name', # overrides user setting above
    keys: %w(~/.ssh/id_rsa),
    forward_agent: true,
    auth_methods: %w(publickey),
    #password: 'use a key instead'
  }