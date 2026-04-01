/** @odoo-module **/
import { ProductCard } from "@point_of_sale/app/generic_components/product_card/product_card";
import { usePos } from "@point_of_sale/app/store/pos_hook";
import { patch } from "@web/core/utils/patch";
import { useService } from "@web/core/utils/hooks";
import { useState } from "@odoo/owl";

patch(ProductCard.prototype, {
    setup() {
        super.setup();
        this.pos = usePos();
        this.orm = useService("orm");
        this.state = useState({
            avail_qty: null,
            show_qty: false,
        });
    },

    async fetchProductDetails(productIds) {
        const configId = this.pos.config.id;
        const res = await this.orm.call(
            "product.product",
            "get_qty_by_pos_location",
            [productIds, configId]
        );
        return res;
    },

    async updateProductDetails() {
        const productCache = this.pos.product_product;
        const productId = this.props.productId;

        const main_product = productCache.find(product => product.id === productId);

        if (!main_product) return;

        const tmplId = main_product.raw.product_tmpl_id;
        let total_qty_available = 0;
        if (main_product.combo_ids.length > 0) {
            total_qty_available = 'NA'
        }
        const canShowQty = main_product.is_storable === true && main_product.type === "consu";

        if (canShowQty) {
            const variants = productCache.filter(
                (p) => p.raw.product_tmpl_id === tmplId
            );
            const variantIds = variants.map((v) => v.id);
            const qtyByProduct = await this.fetchProductDetails(variantIds);

            variants.forEach((variant) => {
                const qty = qtyByProduct[variant.id] || 0;
                variant.qty_available = qty;
                total_qty_available += qty;
            });
        }
        else{
            this.state.show_qty = false;
        }

        this.qty_available = total_qty_available;
    },

    get value() {
        this.updateProductDetails().then(() => {
            this.state.avail_qty = this.qty_available
            });
        return {
            show_qty: true,
        };
    },
});
