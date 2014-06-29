# config/deploy/production.rb
set :stage, :production

server 'frankthedev.com', user: 'deploy', roles: %w{web app}

server 'frankthedev.com',
  user: 'deploy',
  roles: %w{web app},
  ssh_options: {
#    user: 'user_name', # overrides user setting above
    keys: %w(~/.ssh/id_rsa),
    forward_agent: true,
    auth_methods: %w(publickey password),
    #password: 'use a key instead'
  }