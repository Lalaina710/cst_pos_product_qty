# -*- coding: utf-8 -*-

from odoo import api, fields, models, _


class ProductProduct(models.Model):
    _inherit = 'product.product'

    @api.model
    def _load_pos_data_fields(self, config_id):
        data = super()._load_pos_data_fields(config_id)
        data += ['qty_available', 'type', 'is_storable']
        return data

    @api.model
    def get_qty_by_pos_location(self, product_ids, config_id):
        """Return available product quantities (on-hand minus reserved) for the POS stock location."""
        config = self.env['pos.config'].browse(config_id)
        location = config.picking_type_id.default_location_src_id
        if not location:
            return {}
        location_ids = location.child_internal_location_ids.ids
        quants = self.env['stock.quant'].sudo().read_group(
            domain=[
                ('product_id', 'in', product_ids),
                ('location_id', 'in', location_ids),
            ],
            fields=['product_id', 'quantity:sum', 'reserved_quantity:sum'],
            groupby=['product_id'],
        )
        return {
            q['product_id'][0]: q['quantity'] - q['reserved_quantity']
            for q in quants
        }
