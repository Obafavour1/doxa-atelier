import { asyncHandler } from "../../shared/utils/asyncHandler.util.js";
import { ErrorHandler } from "../../shared/middleware/error.middleware.js";
import { successResponse } from "../../shared/utils/response.util.js";
import StoreSetting from "../../database/models/settings.model.js";
import ShippingZone from "../../database/models/shipping.model.js";
import AuditLog from "../../database/models/auditLog.model.js";

// --- Store Settings ---

export const getStoreSettings = asyncHandler(async (req, res) => {
  let settings = await StoreSetting.findOne();
  if (!settings) settings = await StoreSetting.create({});
  return successResponse(res, "Store settings fetched", { settings });
});

export const updateStoreSettings = asyncHandler(async (req, res) => {
  let settings = await StoreSetting.findOne();
  if (!settings) {
    settings = await StoreSetting.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }

  await AuditLog.create({ user: req.user._id, action: "Updated general store settings", module: "Settings", ipAddress: req.ip });
  return successResponse(res, "Settings updated successfully", { settings });
});

// --- Shipping Zones ---

export const getShippingZones = asyncHandler(async (req, res) => {
  const zones = await ShippingZone.find();
  return successResponse(res, "Shipping zones fetched", { zones });
});

export const createShippingZone = asyncHandler(async (req, res) => {
  const zone = await ShippingZone.create(req.body);
  await AuditLog.create({ user: req.user._id, action: `Created shipping zone: ${zone.name}`, module: "Shipping", ipAddress: req.ip });
  return successResponse(res, "Shipping zone created successfully", { zone }, 201);
});

export const updateShippingZone = asyncHandler(async (req, res) => {
  const zone = await ShippingZone.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!zone) throw new ErrorHandler("Zone not found", 404);
  return successResponse(res, "Shipping zone updated successfully", { zone });
});

export const deleteShippingZone = asyncHandler(async (req, res) => {
  const zone = await ShippingZone.findByIdAndDelete(req.params.id);
  if (!zone) throw new ErrorHandler("Zone not found", 404);
  return successResponse(res, "Shipping zone deleted successfully");
});
