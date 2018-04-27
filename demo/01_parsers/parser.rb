require 'parser/current'

pp Parser::CurrentRuby.parse(ARGF.read)
