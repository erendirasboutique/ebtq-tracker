"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const carriers = [{ label: "Auto detect", esLabel: "Detectar automáticamente", value: "auto" },{ label: "USPS", esLabel: "USPS", value: "usps" },{ label: "UPS", esLabel: "UPS", value: "ups" },{ label: "FedEx", esLabel: "FedEx", value: "fedex" }];

const progressSteps = [{ en: "Order shipped", es: "Pedido enviado" },{ en: "In transit", es: "En tránsito" },{ en: "Out for delivery", es: "En reparto" },{ en: "Delivered!", es: "Entregado!" }];

const text = {en: {navPill: "Order tracking",eyebrow: "Erendira's Boutique",heroTitle: "Track your order with ease.",heroText: "Enter your tracking n
