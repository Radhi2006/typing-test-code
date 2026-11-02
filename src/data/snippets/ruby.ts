import { CodeSnippet } from '../../types/snippet';

const snippets: CodeSnippet[] = [
  {
    id: 'rb-001',
    language: 'ruby',
    title: 'Block with Each',
    description: 'Iterate over an array using a block',
    code: `fruits = ["apple", "banana", "cherry"]
fruits.each do |fruit|
  puts fruit.upcase
end`,
    difficulty: 'easy',
    tags: ['blocks', 'iteration'],
  },
  {
    id: 'rb-002',
    language: 'ruby',
    title: 'Map and Select',
    description: 'Transform and filter an array',
    code: `numbers = (1..10).to_a
evens = numbers.select { |n| n.even? }
squared = evens.map { |n| n ** 2 }`,
    difficulty: 'easy',
    tags: ['enumerable', 'array'],
  },
  {
    id: 'rb-003',
    language: 'ruby',
    title: 'Lambda Definition',
    description: 'Create and call a lambda',
    code: `double = ->(n) { n * 2 }
triple = lambda { |n| n * 3 }

puts double.call(5)
puts triple.call(5)`,
    difficulty: 'easy',
    tags: ['lambdas', 'functions'],
  },
  {
    id: 'rb-004',
    language: 'ruby',
    title: 'Hash with Default',
    description: 'Create a hash with a default value',
    code: `counter = Hash.new(0)
words = ["hello", "world", "hello"]
words.each { |w| counter[w] += 1 }
puts counter`,
    difficulty: 'easy',
    tags: ['hash', 'enumerable'],
  },
  {
    id: 'rb-005',
    language: 'ruby',
    title: 'Module Mixin',
    description: 'Use a module as a mixin for shared behavior',
    code: `module Greetable
  def greet
    "Hello, I'm #{name}"
  end
end

class User
  include Greetable
  attr_reader :name

  def initialize(name)
    @name = name
  end
end`,
    difficulty: 'medium',
    tags: ['modules', 'mixins'],
  },
  {
    id: 'rb-006',
    language: 'ruby',
    title: 'Proc and Yield',
    description: 'Method that accepts a block and uses yield',
    code: `def with_logging(label)
  puts "[START] #{label}"
  result = yield
  puts "[END] #{label}"
  result
end

with_logging("calculation") do
  42 * 2
end`,
    difficulty: 'medium',
    tags: ['procs', 'blocks', 'yield'],
  },
  {
    id: 'rb-007',
    language: 'ruby',
    title: 'Enumerable Reduce',
    description: 'Reduce array to compute factorial',
    code: `def factorial(n)
  return 1 if n <= 1
  (1..n).reduce(:*)
end

def sum_of_squares(arr)
  arr.reduce(0) { |sum, x| sum + x ** 2 }
end`,
    difficulty: 'medium',
    tags: ['enumerable', 'reduce'],
  },
  {
    id: 'rb-008',
    language: 'ruby',
    title: 'Struct with Methods',
    description: 'Define a struct with custom methods',
    code: `Point = Struct.new(:x, :y) do
  def distance_to(other)
    Math.sqrt((x - other.x) ** 2 + (y - other.y) ** 2)
  end

  def to_s
    "(#{x}, #{y})"
  end
end`,
    difficulty: 'medium',
    tags: ['struct', 'methods'],
  },
  {
    id: 'rb-009',
    language: 'ruby',
    title: 'Method Missing',
    description: 'Dynamic method handling with method_missing',
    code: `class DynamicAttributes
  def initialize
    @attributes = {}
  end

  def method_missing(name, *args)
    if name.to_s.end_with?("=")
      @attributes[name.to_s.chomp("=")] = args.first
    else
      @attributes[name.to_s]
    end
  end

  def respond_to_missing?(name, include_private = false)
    true
  end
end`,
    difficulty: 'hard',
    tags: ['metaprogramming', 'method_missing'],
  },
  {
    id: 'rb-010',
    language: 'ruby',
    title: 'DSL Builder',
    description: 'Simple DSL for building HTML',
    code: `class HtmlBuilder
  def initialize
    @html = ""
  end

  def method_missing(tag, content = nil, &block)
    @html += "<#{tag}>"
    if block_given?
      nested = HtmlBuilder.new
      nested.instance_eval(&block)
      @html += nested.to_s
    else
      @html += content.to_s
    end
    @html += "</#{tag}>"
  end

  def to_s
    @html
  end
end`,
    difficulty: 'hard',
    tags: ['dsl', 'metaprogramming', 'builder'],
  },
  {
    id: 'rb-011',
    language: 'ruby',
    title: 'ActiveRecord Style',
    description: 'ActiveRecord-style query scope methods',
    code: `class Product < ApplicationRecord
  scope :active, -> { where(active: true) }
  scope :expensive, ->(min) { where("price >= ?", min) }
  scope :recent, -> { order(created_at: :desc).limit(10) }

  validates :name, presence: true
  validates :price, numericality: { greater_than: 0 }

  belongs_to :category
  has_many :reviews, dependent: :destroy

  def discounted_price(percent)
    price * (1 - percent / 100.0)
  end
end`,
    difficulty: 'hard',
    tags: ['activerecord', 'rails', 'model'],
  },
  {
    id: 'rb-012',
    language: 'ruby',
    title: 'Comparable Module',
    description: 'Include Comparable and define custom ordering',
    code: `class Temperature
  include Comparable

  attr_reader :value, :unit

  def initialize(value, unit = :celsius)
    @value = value
    @unit = unit
  end

  def to_celsius
    unit == :fahrenheit ? (value - 32) * 5.0 / 9 : value
  end

  def <=>(other)
    to_celsius <=> other.to_celsius
  end

  def to_s
    "#{value}°#{unit.to_s[0].upcase}"
  end
end`,
    difficulty: 'hard',
    tags: ['modules', 'comparable', 'oop'],
  },
];

export default snippets;
