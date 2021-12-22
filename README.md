## Details of Test

[Live test site](https://test-store6338.mybigcommerce.com/)

Access Code: ```zcolop04rs```

1. Special product created and images added using the web UI.

2. Product's second image on hover on category page.
    - Created a new card.html which can be found at ```templates/components/products/card-hover-img.html```
    - This references a new responsive-image component at: ```/templates/components/common/responsive-img-change-hover.html```
    - This component adds a hover_imgage argument which is used to add a 'onmouseover' attribute to the ```<img>``` tag.
        - This implementation requires more work before production. 

3. Add All To Cart Button
    - Edits made to category.js found at ```/assets/js/theme/category.js```
    - Button added to category.html at ```templates/pages/category.html``` on line 53
    - onclick calls ```addAllToCart()``` on line 75
        - fetch POST request to the Storefront API
        - on response, modal is displayed to user.

4. Clear Cart Button
    - Edits made to category.js found at ```/assets/js/theme/category.js```
    - Button added to category.html at ```templates/pages/category.html``` on line 55
        - Button is only visible if cart exisits.
    - onclick calls ```deleteItemsCart()``` on line 60
         - fetch DELETE request to Storefront API.
         - on response, modal is displayed to user.
         

## Submission Instructions:

Setup 
---------- 
Sign up for a BigCommerce trial store, this will be valid for 15 days and will be needed to complete the test 
Install Stencil CLI for local development, you will be using the default Cornerstone Theme that comes standard with new BigCommerce stores 

* Refer to the BigCommerce developer documentation for any questions you might have. It will contain all the info needed to complete the tasks below 


Task 
---------- 
Create a product called Special Item which will be assigned to a new category called Special Items. Be sure to add at least 2 images during the product creation 

The Special Item should be the only item which shows in this category - create a feature that will show the product's second image when it is hovered on. 

Add a button at the top of the category page labeled Add All To Cart. When clicked, the product will be added to the cart. Notify the user that the product has been added. 

If the cart has an item in it - show a button next to the Add All To Cart button which says Remove All Items. When clicked it should clear the cart and notify the user. 

Both buttons should utilize the Storefront API for completion. 

Bonus 
---------- 
If a customer is logged in - at the top of the category page show a banner that shows some customer details (i.e. name, email, phone, etc). This should utilize the data that is rendered via Handlebars on the Customer Object. 

Submission 
-------------------- 
Create a GitHub repo for your codebase . In the Readme file remove the current data and add your own which describes a brief overview of your test. 
Be sure you include the Preview Code for the Bigcommerce Store, along with its URL, so we can view it. Then reply to this email with the Github repo link. 

Candidates typically send this back to us in 3-4 days. 

This is not an offer of employment or work, but rather a step in the interview process. Let me know if you have any questions! 