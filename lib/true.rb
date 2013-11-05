true_stylesheets_path = File.expand_path(File.join(File.dirname(__FILE__), '..', 'sass'))
begin
  require 'compass'
  Compass::Frameworks.register('true', :stylesheets_directory => true_stylesheets_path)
rescue LoadError
  # compass not found, register on the Sass path via the environment.
  if ENV.has_key?("SASSPATH")
    ENV["SASSPATH"] = ENV["SASSPATH"] + File::PATH_SEPARATOR + true_stylesheets_path
  else
    ENV["SASSPATH"] = true_stylesheets_path
  end
end
