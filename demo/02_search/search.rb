require 'parser/current'

class Searcher < Parser::AST::Processor
  def initialize(text)
    @text = text
    super()
  end

  def on_str(node)
    if node.children[0].include?(@text)
      @results << node
    end
  end

  def search(node)
    @results = []
    process(node)
    @results.each do |node|
      printf("L%02d: %s\n", node.loc.line, node.loc.expression.source)
    end
  end
end

text, source_path = ARGV
ast = Parser::CurrentRuby.parse_file(source_path)

Searcher.new(text).search(ast)
