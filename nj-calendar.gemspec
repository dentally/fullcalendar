# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'nj-calendar/version'

Gem::Specification.new do |spec|
  spec.name          = "nj-calendar"
  spec.version       = NjCalendar::VERSION
  spec.authors       = ["Jonathan Wheeler"]
  spec.email         = ["jonny@njtechnologies.co.uk"]
  spec.summary       = "An adapted version of arshaws fullcalendar.js for use in company projects."
  spec.description   = "see https://github.com/arshaw/fullcalendar for orginal project"
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = Dir["{app}/**/*"] + Dir["{lib/nj-calendar}/**/*"] + ["lib/nj-calendar.rb", "README.md"]  
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]

  spec.add_development_dependency "bundler", "~> 1.6"
  spec.add_development_dependency "rake"
  spec.add_dependency "railties", ">= 4.1.4"  
end
