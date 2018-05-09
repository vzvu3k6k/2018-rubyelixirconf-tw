require 'parser/current'

class Rewriter < Parser::TreeRewriter
  def initialize(from, to)
    @from = from
    @to = to
  end

  def on_str(node)
    if node.children[0].include?(@from)
      exp = node.loc.expression
      replace(exp, exp.source.gsub(@from, @to))
    end
  end
end

source_path = ARGV.first
buf = Parser::Source::Buffer.new('test')
buf.source = File.read(source_path)
ast = Parser::CurrentRuby.parse(buf.source)

puts Rewriter.new('nihao', '你好').rewrite(buf, ast)
