#!/usr/bin/env ruby

require 'rack/contrib'
require 'sinatra/base'
require 'sinatra/param'
require 'sinatra/cross_origin'
require 'json'
require 'yaml'
require 'selenium-webdriver'

class Main < Sinatra::Application
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
    param :mail, String , required: true
    param :password , String, required: true
    @driver = login(params[:mail], params[:password])
  end

  options "*" do
    response.headers["Access-Control-Allow-Methods"] = "HEAD,GET,PUT,POST,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept"
    "ok"
  end

  get '/' do
    redirect to('index.html')
  end

  get '/api/projects/' do
    projects(params)
  end

  get '/api/input/' do
    param :start, String , required: true
    param :end, String , required: true
    input(params[:start], params[:end])
  end

  def projects(params)
    #PJドロップダウンリスト取得
    @driver.find_element(:id, "select-pjList").to_s
  end

  def login(mail, password)
    driver = Selenium::WebDriver.for :chrome, switches: %w[--no-sandbox]
    driver.get "http://tr.ever-rise.co.jp/dailyReportEdit/"
    element = driver.find_element(:name, "emailAddress")
    element.send_keys(mail)
    element = driver.find_element(:name, "password")
    element.send_keys(password)
    driver.find_element(:name, 'doLogin').click
    driver
  end

  def input(start_time, end_time)
    @driver.find_element(:name, "str_start_time").send_keys(start_time)
    @driver.find_element(:name, "str_end_time").send_keys(end_time)
    @driver.find_element(:name, "db_repose_time").send_keys('1.00')
    @driver.find_element(:class, 'selectedValue').click
    @driver.find_element(:class, 'itm-' + project).click
    @driver.find_element(:clasqs, 'btn-open').click
    @driver.find_element(:name, 'reportadd').click
    driver.save_screenshot("./screenshot.png")
    driver.quit
  end
end

