export type PermissionRisk = "low" | "medium" | "high";

export type PermissionKey =
    | "camera"
    | "microphone"
    | "contacts"
    | "sms"
    | "location"
    | "bluetooth"
    | "storage"
    | "notifications"
    | "accessibility";

export type PermissionExplanation = {
    key: PermissionKey;
    name: string;
    allows: string;
    commonReasons: string[];
    risk: PermissionRisk;
    riskExplanation: string;
};

export const permissionKnowledgeBase: Record<PermissionKey, PermissionExplanation> = {
    camera: {
        key: "camera",
        name: "Camera",
        allows: "Take photos and record video.",
        commonReasons: ["Video calls", "Scanning QR codes", "Capturing photos"],
        risk: "medium",
        riskExplanation: "Camera access can reveal people, places, or documents when it is active.",
    },
    microphone: {
        key: "microphone",
        name: "Microphone",
        allows: "Record audio from the device microphone.",
        commonReasons: ["Voice calls", "Voice messages", "Audio recording"],
        risk: "medium",
        riskExplanation: "Microphone access can capture conversations or background sounds.",
    },
    contacts: {
        key: "contacts",
        name: "Contacts",
        allows: "Read or use saved contacts.",
        commonReasons: ["Finding friends", "Inviting people", "Sharing with contacts"],
        risk: "medium",
        riskExplanation: "Contact data can reveal relationships and may be uploaded to a service.",
    },
    sms: {
        key: "sms",
        name: "SMS",
        allows: "Read, send, or receive text messages.",
        commonReasons: ["Verification codes", "Messaging", "Filling one-time passwords"],
        risk: "high",
        riskExplanation: "Messages can contain private conversations and account verification codes.",
    },
    location: {
        key: "location",
        name: "Location",
        allows: "Estimate where the device is located.",
        commonReasons: ["Maps and navigation", "Nearby services", "Location sharing"],
        risk: "high",
        riskExplanation: "Location history can reveal routines, visits, and places a person spends time.",
    },
    bluetooth: {
        key: "bluetooth",
        name: "Bluetooth",
        allows: "Connect to nearby Bluetooth devices.",
        commonReasons: ["Headphones", "Wearables", "Nearby device setup"],
        risk: "low",
        riskExplanation: "Bluetooth access is usually limited to nearby device discovery and connection.",
    },
    storage: {
        key: "storage",
        name: "Storage and photos",
        allows: "Read, create, or manage files and photos.",
        commonReasons: ["Uploading photos", "Saving downloads", "Editing files"],
        risk: "medium",
        riskExplanation: "Files and photos may contain personal, financial, or identifying information.",
    },
    notifications: {
        key: "notifications",
        name: "Notifications",
        allows: "Send alerts and updates to the device.",
        commonReasons: ["Messages", "Reminders", "Account activity"],
        risk: "low",
        riskExplanation: "Notifications can expose message previews or other information on the lock screen.",
    },
    accessibility: {
        key: "accessibility",
        name: "Accessibility",
        allows: "Observe screen content and assist with device interactions.",
        commonReasons: ["Screen readers", "Assistive controls", "Device automation"],
        risk: "high",
        riskExplanation: "Broad accessibility access can expose screen content and enable interactions on your behalf.",
    },
};

const aliases: Record<string, PermissionKey> = {
    camera: "camera",
    microphone: "microphone",
    contacts: "contacts",
    sms: "sms",
    location: "location",
    bluetooth: "bluetooth",
    storage: "storage",
    photos: "storage",
    notifications: "notifications",
    accessibility: "accessibility",
};

export function normalizePermission(value: string): PermissionKey | null {
    const normalized = value.toLowerCase().replace(/android\.permission\.|permission_|permission\.|[^a-z]/g, "");

    if (aliases[normalized]) {
        return aliases[normalized];
    }

    if (normalized.includes("camera")) return "camera";
    if (normalized.includes("microphone") || normalized.includes("recordaudio")) return "microphone";
    if (normalized.includes("contact")) return "contacts";
    if (normalized.includes("sms") || normalized.includes("message")) return "sms";
    if (normalized.includes("location")) return "location";
    if (normalized.includes("bluetooth")) return "bluetooth";
    if (normalized.includes("storage") || normalized.includes("photo") || normalized.includes("media")) return "storage";
    if (normalized.includes("notification")) return "notifications";
    if (normalized.includes("accessibility")) return "accessibility";

    return null;
}

export function explainPermissions(values: string[]): PermissionExplanation[] {
    const keys = values.map(normalizePermission).filter((key): key is PermissionKey => key !== null);
    return [...new Set(keys)].map((key) => permissionKnowledgeBase[key]);
}