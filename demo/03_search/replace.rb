require 'parser/current'

class Rewriter < Parser::Rewriter
  def on_str(node)
    if node.children[0].include?(@text)
      exp = node.loc.expression
      replace(exp, exp.source.gsub('nihao', '你好'))
    end
  end
end

source_path = ARGV
ast = Parser::CurrentRuby.parse_file(source_path)

Searcher.new(text).search(ast)
