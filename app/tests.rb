#!/usr/bin/env ruby

require 'rack/contrib'
require 'sinatra/base'
require 'sinatra/param'
require 'sinatra/cross_origin'
require 'json'
require 'yaml'
require 'selenium-webdriver'

class AutoInput < Sinatra::Application
  enable :method_override
  set :show_exceptions, false
  helpers Sinatra::Param

  configure do
    enable :cross_origin
    register Sinatra::CrossOrigin
    set :allow_methods, [:get, :post, :options, :put, :delete]
    set :public_folder, 'public'
  end

  before do
    cross_origin
    @ary = Array.new
    @hash = Hash.new { |h, k| h[k] = [] }
    content_type :json
  end

  options "*" do
    response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept"
    "ok"
  end

  get '/' do
    redirect to('index.html')
  end
# driver = Selenium::WebDriver.for :firefox
# # driver = Selenium::WebDriver.for :chrome, switches: %w[--no-sandbox]

# driver.navigate.to "https://www.yahoo.co.jp/"
# driver.save_screenshot("./screenshot.png")

# driver.quit
end

