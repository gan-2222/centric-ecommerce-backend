//src/controllers/address.controller.js

const { Address } = require("../models");

/**
 * GET all addresses for logged-in user
 */
exports.getMyAddresses = async (req, res) => {
  const addresses = await Address.findAll({
    where: { user_id: req.user.id },
    order: [["is_default", "DESC"], ["id", "DESC"]],
  });
  res.json(addresses);
};

/**
 * ADD new address
 */
exports.createAddress = async (req, res) => {
  const {
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    is_default = false,
  } = req.body;

  if (is_default) {
    await Address.update(
      { is_default: false },
      { where: { user_id: req.user.id } }
    );
  }

  const address = await Address.create({
    user_id: req.user.id,
    address_line1,
    address_line2,
    city,
    state,
    postal_code,
    country,
    is_default,
  });

  res.status(201).json(address);
};

/**
 * UPDATE address
 */
exports.updateAddress = async (req, res) => {
  const address = await Address.findOne({
    where: { id: req.params.id, user_id: req.user.id },
  });

  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  if (req.body.is_default === true) {
    await Address.update(
      { is_default: false },
      { where: { user_id: req.user.id } }
    );
  }

  await address.update(req.body);
  res.json(address);
};

/**
 * DELETE address
 */
exports.deleteAddress = async (req, res) => {
  const address = await Address.findOne({
    where: { id: req.params.id, user_id: req.user.id },
  });

  if (!address) {
    return res.status(404).json({ message: "Address not found" });
  }

  await address.destroy();
  res.json({ message: "Address deleted" });
};
