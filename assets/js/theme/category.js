import { hooks } from '@bigcommerce/stencil-utils';
import { defaultModal } from './global/modal';
import CatalogPage from './catalog';
import compareProducts from './global/compare-products';
import FacetedSearch from './common/faceted-search';
import { createTranslationDictionary } from '../theme/common/utils/translations-utils';

export default class Category extends CatalogPage {
    constructor(context) {
        super(context);
        this.validationDictionary = createTranslationDictionary(context);
    }

    setLiveRegionAttributes($element, roleType, ariaLiveStatus) {
        $element.attr({
            role: roleType,
            'aria-live': ariaLiveStatus,
        });
    }

    makeShopByPriceFilterAccessible() {
        if (!$('[data-shop-by-price]').length) return;

        if ($('.navList-action').hasClass('is-active')) {
            $('a.navList-action.is-active').focus();
        }

        $('a.navList-action').on('click', () => this.setLiveRegionAttributes($('span.price-filter-message'), 'status', 'assertive'));
    }

    onReady() {
        this.arrangeFocusOnSortBy();

        $('[data-button-type="add-cart"]').on('click', (e) => this.setLiveRegionAttributes($(e.currentTarget).next(), 'status', 'polite'));

        this.makeShopByPriceFilterAccessible();

        compareProducts(this.context);

        if ($('#facetedSearch').length > 0) {
            this.initFacetedSearch();
        } else {
            this.onSortBySubmit = this.onSortBySubmit.bind(this);
            hooks.on('sortBy-submitted', this.onSortBySubmit);
        }

        $('a.reset-btn').on('click', () => this.setLiveRegionsAttributes($('span.reset-message'), 'status', 'polite'));

        this.ariaNotifyNoProducts();

        let add_cart_id = document.querySelector('.add-all-to-cart').getAttribute('data-cart-id');
        $('.add-all-to-cart').on('click', () => this.addAllToCart(add_cart_id));

        if ($('.clear-cart').length > 0) {
            let cl_cart_id = document.querySelector('.clear-cart').getAttribute('data-cart-id');
            $('.clear-cart').on('click', () => this.deleteItemsCart(cl_cart_id));
        }
    }

    deleteItemsCart(cartId){
        fetch('/api/storefront/carts/' + cartId, {
            method: "DELETE",
            credentials: "same-origin",
        })
        .then(response => {
            if (response.ok) {
                let modal = defaultModal()
                modal.open()
                modal.updateContent(`<h3>Cart Cleared.</h3>`, { wrap: true });
            }
        })
        .catch(error => console.log(error));
    }

    addAllToCart(cartId) {
        var products = this.context.categoryProducts;
        var item_ids = [];
        products.forEach(function (e) {
            item_ids.push({'quantity': 1, 'productId': e.id});
        })

        if (cartId) {
            var url = `/api/storefront/carts/` + cartId + '/items';
        } else {
            var url = `/api/storefront/carts`;
        }
        fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "lineItems": item_ids }),
        })
        .then(response => response.json())
        .then(response => {
            if (response) {
                let modal = defaultModal()
                modal.open()
                modal.updateContent(`<h3>All the items in this category added to cart.</h3>`, { wrap: true });
            }
        })
        .catch(err => console.log(err));
    }

    ariaNotifyNoProducts() {
        const $noProductsMessage = $('[data-no-products-notification]');
        if ($noProductsMessage.length) {
            $noProductsMessage.focus();
        }
    }

    initFacetedSearch() {
        const {
            price_min_evaluation: onMinPriceError,
            price_max_evaluation: onMaxPriceError,
            price_min_not_entered: minPriceNotEntered,
            price_max_not_entered: maxPriceNotEntered,
            price_invalid_value: onInvalidPrice,
        } = this.validationDictionary;
        const $productListingContainer = $('#product-listing-container');
        const $facetedSearchContainer = $('#faceted-search-container');
        const productsPerPage = this.context.categoryProductsPerPage;
        const requestOptions = {
            config: {
                category: {
                    shop_by_price: true,
                    products: {
                        limit: productsPerPage,
                    },
                },
            },
            template: {
                productListing: 'category/product-listing',
                sidebar: 'category/sidebar',
            },
            showMore: 'category/show-more',
        };

        this.facetedSearch = new FacetedSearch(requestOptions, (content) => {
            $productListingContainer.html(content.productListing);
            $facetedSearchContainer.html(content.sidebar);

            $('body').triggerHandler('compareReset');

            $('html, body').animate({
                scrollTop: 0,
            }, 100);
        }, {
            validationErrorMessages: {
                onMinPriceError,
                onMaxPriceError,
                minPriceNotEntered,
                maxPriceNotEntered,
                onInvalidPrice,
            },
        });
    }
}
