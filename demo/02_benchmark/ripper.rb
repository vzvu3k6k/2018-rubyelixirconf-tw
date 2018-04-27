require 'ripper'

class Visitor < Ripper
  attr_reader :count

  def initialize(*)
    @count = 0
    super
  end

  def on_send(*)
    @count += 1
  end

  %i[call fcall vcall binary unary].each do |event|
    alias_method :"on_#{event}", :on_send
  end
end

visitor = Visitor.new(ARGF.read)
visitor.parse
p visitor.count
