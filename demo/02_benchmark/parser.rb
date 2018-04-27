require 'parser/current'

ast = Parser::CurrentRuby.parse(ARGF.read)

def walk(node)
  return 0 unless node.respond_to?(:children)
  child = node.children.inject(0) { |sum, node| sum + walk(node) }
  node.type == :send ? child + 1 : child
end

p(walk(ast))
