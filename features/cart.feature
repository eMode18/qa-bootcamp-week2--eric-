Feature: Shopping cart
  As a shopper on the Toolshop
  I want to put products in my cart and change them
  So that I buy exactly what I need

  Background:
    Given the shopper is on the Toolshop home page
    And the shopper's cart is empty

  Scenario: A shopper adds a product to the cart
    When the shopper opens the "Combination Pliers" product
    And the shopper adds it to the cart
    Then the cart shows 1 item
    And the cart lists "Combination Pliers" with quantity 1

  Scenario: A shopper buys more than one of the same product
    When the shopper opens the "Combination Pliers" product
    And the shopper sets the quantity to 3
    And the shopper adds it to the cart
    Then the cart lists "Combination Pliers" with quantity 3
    And the line total is 3 times the product's price

  Scenario: A shopper removes a product from the cart
    Given the shopper has "Combination Pliers" in the cart
    When the shopper removes "Combination Pliers" from the cart
    Then the cart is empty
