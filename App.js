
import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, Pressable, ScrollView, TextInput,
  StyleSheet, Alert, StatusBar
} from "react-native";

const COLORS = {
  red: "#8A1020",
  deepRed: "#5D0B16",
  gold: "#D7A72C",
  cream: "#FFF8EA",
  white: "#FFFFFF",
  ink: "#241B16",
  muted: "#806F64",
  line: "#E9D9BE",
  green: "#18794E",
};

const PRODUCTS = [
  { id: "tee", nameEn: "Khmer T-Shirt", nameKm: "អាវយឺតខ្មែរ", price: 20, emoji: "👕", category: "T-Shirts" },
  { id: "case", nameEn: "Khmer Phone Case", nameKm: "ស្រោមទូរស័ព្ទខ្មែរ", price: 12, emoji: "📱", category: "Phone Cases" },
  { id: "tumbler", nameEn: "20 oz Tumbler", nameKm: "កែវ Tumbler 20 oz", price: 25, emoji: "🥤", category: "Tumblers" },
  { id: "apron", nameEn: "Khmer Apron", nameKm: "អាវអៀមខ្មែរ", price: 15, emoji: "🧑‍🍳", category: "Aprons" },
];

const COPY = {
  en: {
    brand: "KHMER HOME STORE",
    tagline: "Proudly Khmer • Made with Love",
    home: "Home",
    shop: "Shop",
    custom: "Custom",
    cart: "Cart",
    account: "Account",
    heroTitle: "Khmer Style, Made for You",
    heroText: "Shop T-shirts, phone cases, tumblers, aprons and custom gifts.",
    shopNow: "Shop Now",
    featured: "Featured Products",
    add: "Add to Cart",
    added: "Added to cart",
    search: "Search products...",
    customTitle: "Custom Order",
    customText: "Tell us what you want printed. We will confirm the design and final price before production.",
    name: "Your name",
    contact: "Phone or email",
    request: "Describe your custom order",
    send: "Save Custom Request",
    saved: "Custom request saved on this device.",
    yourCart: "Your Cart",
    empty: "Your cart is empty.",
    subtotal: "Subtotal",
    checkout: "Checkout",
    square: "Pay with Square",
    squareNote: "Square payment connection is ready to be added after your Square developer credentials and backend are configured.",
    accountTitle: "My Account",
    accountText: "Customer sign-in and order history can be connected to a backend in the next version.",
    qty: "Qty",
    remove: "Remove",
    checkoutDemo: "Square payment is not live yet. The app structure is ready for the secure Square connection.",
  },
  km: {
    brand: "KHMER HOME STORE",
    tagline: "មោទនភាពជាខ្មែរ • ធ្វើដោយក្តីស្រឡាញ់",
    home: "ទំព័រដើម",
    shop: "ទំនិញ",
    custom: "កម្មង់ផ្ទាល់ខ្លួន",
    cart: "កន្ត្រក",
    account: "គណនី",
    heroTitle: "រចនាបថខ្មែរ សម្រាប់អ្នក",
    heroText: "ទិញអាវ ស្រោមទូរស័ព្ទ កែវ Tumbler អាវអៀម និងអំណោយកម្មង់ផ្ទាល់ខ្លួន។",
    shopNow: "ទិញឥឡូវ",
    featured: "ទំនិញពិសេស",
    add: "ដាក់ចូលកន្ត្រក",
    added: "បានដាក់ចូលកន្ត្រក",
    search: "ស្វែងរកទំនិញ...",
    customTitle: "កម្មង់ផ្ទាល់ខ្លួន",
    customText: "ប្រាប់យើងអ្វីដែលអ្នកចង់បោះពុម្ព។ យើងនឹងបញ្ជាក់រចនា និងតម្លៃចុងក្រោយមុនផលិត។",
    name: "ឈ្មោះរបស់អ្នក",
    contact: "លេខទូរស័ព្ទ ឬ អ៊ីមែល",
    request: "ពិពណ៌នាកម្មង់របស់អ្នក",
    send: "រក្សាទុកសំណើ",
    saved: "បានរក្សាទុកសំណើនៅលើទូរស័ព្ទនេះ។",
    yourCart: "កន្ត្រករបស់អ្នក",
    empty: "កន្ត្រករបស់អ្នកទទេ។",
    subtotal: "សរុប",
    checkout: "បង់ប្រាក់",
    square: "បង់ជាមួយ Square",
    squareNote: "អាចភ្ជាប់ Square បន្ទាប់ពីរៀបចំ Square developer credentials និង backend។",
    accountTitle: "គណនីរបស់ខ្ញុំ",
    accountText: "អាចបន្ថែមការចូលគណនីអតិថិជន និងប្រវត្តិកម្មង់នៅជំហានបន្ទាប់។",
    qty: "ចំនួន",
    remove: "លុប",
    checkoutDemo: "Square មិនទាន់ live ទេ។ App បានរៀបចំរួចសម្រាប់ភ្ជាប់ការបង់ប្រាក់មានសុវត្ថិភាព។",
  },
};

function ProductCard({ p, lang, onAdd }) {
  return (
    <View style={styles.card}>
      <View style={styles.productImage}><Text style={styles.emoji}>{p.emoji}</Text></View>
      <Text style={styles.productName}>{lang === "en" ? p.nameEn : p.nameKm}</Text>
      <Text style={styles.price}>${p.price.toFixed(2)}</Text>
      <Pressable style={styles.goldButton} onPress={() => onAdd(p)}>
        <Text style={styles.goldButtonText}>{COPY[lang].add}</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [lang, setLang] = useState("en");
  const [cart, setCart] = useState({});
  const [search, setSearch] = useState("");
  const [custom, setCustom] = useState({ name: "", contact: "", request: "" });
  const t = COPY[lang];

  const cartCount = Object.values(cart).reduce((a, x) => a + x.qty, 0);
  const subtotal = Object.values(cart).reduce((a, x) => a + x.qty * x.product.price, 0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return PRODUCTS;
    return PRODUCTS.filter(p =>
      p.nameEn.toLowerCase().includes(q) ||
      p.nameKm.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [search]);

  const addToCart = (p) => {
    setCart(prev => ({
      ...prev,
      [p.id]: { product: p, qty: (prev[p.id]?.qty || 0) + 1 }
    }));
  };

  const updateQty = (id, diff) => {
    setCart(prev => {
      const item = prev[id];
      if (!item) return prev;
      const nextQty = item.qty + diff;
      const copy = { ...prev };
      if (nextQty <= 0) delete copy[id];
      else copy[id] = { ...item, qty: nextQty };
      return copy;
    });
  };

  const saveCustom = () => {
    if (!custom.name || !custom.contact || !custom.request) {
      Alert.alert("Khmer Home Store", "Please fill in all custom-order fields.");
      return;
    }
    Alert.alert("Khmer Home Store", t.saved);
    setCustom({ name: "", contact: "", request: "" });
  };

  const renderHome = () => (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.hero}>
        <Text style={styles.heroBadge}>🇰🇭</Text>
        <Text style={styles.heroTitle}>{t.heroTitle}</Text>
        <Text style={styles.heroText}>{t.heroText}</Text>
        <Pressable style={styles.heroButton} onPress={() => setTab("shop")}>
          <Text style={styles.heroButtonText}>{t.shopNow}</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>{t.featured}</Text>
      <View style={styles.grid}>
        {PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} p={p} lang={lang} onAdd={addToCart} />)}
      </View>
    </ScrollView>
  );

  const renderShop = () => (
    <ScrollView contentContainerStyle={styles.scroll}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder={t.search}
        placeholderTextColor={COLORS.muted}
        style={styles.input}
      />
      <View style={styles.grid}>
        {filtered.map(p => <ProductCard key={p.id} p={p} lang={lang} onAdd={addToCart} />)}
      </View>
    </ScrollView>
  );

  const renderCustom = () => (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.pageTitle}>{t.customTitle}</Text>
      <Text style={styles.bodyText}>{t.customText}</Text>
      <TextInput style={styles.input} placeholder={t.name} placeholderTextColor={COLORS.muted}
        value={custom.name} onChangeText={v => setCustom({ ...custom, name: v })} />
      <TextInput style={styles.input} placeholder={t.contact} placeholderTextColor={COLORS.muted}
        value={custom.contact} onChangeText={v => setCustom({ ...custom, contact: v })} />
      <TextInput style={[styles.input, styles.textarea]} placeholder={t.request} placeholderTextColor={COLORS.muted}
        value={custom.request} multiline onChangeText={v => setCustom({ ...custom, request: v })} />
      <Pressable style={styles.primaryButton} onPress={saveCustom}>
        <Text style={styles.primaryButtonText}>{t.send}</Text>
      </Pressable>
    </ScrollView>
  );

  const renderCart = () => (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.pageTitle}>{t.yourCart}</Text>
      {Object.keys(cart).length === 0 ? <Text style={styles.bodyText}>{t.empty}</Text> :
        Object.values(cart).map(({ product, qty }) => (
          <View key={product.id} style={styles.cartRow}>
            <Text style={styles.cartEmoji}>{product.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.cartName}>{lang === "en" ? product.nameEn : product.nameKm}</Text>
              <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            </View>
            <View style={styles.qtyBox}>
              <Pressable style={styles.qtyButton} onPress={() => updateQty(product.id, -1)}><Text style={styles.qtyText}>−</Text></Pressable>
              <Text style={styles.qtyNumber}>{qty}</Text>
              <Pressable style={styles.qtyButton} onPress={() => updateQty(product.id, 1)}><Text style={styles.qtyText}>+</Text></Pressable>
            </View>
          </View>
        ))
      }
      {Object.keys(cart).length > 0 && (
        <View style={styles.checkoutBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t.subtotal}</Text>
            <Text style={styles.total}>${subtotal.toFixed(2)}</Text>
          </View>
          <Pressable style={styles.squareButton} onPress={() => Alert.alert("Square", t.checkoutDemo)}>
            <Text style={styles.squareButtonText}>▣ {t.square}</Text>
          </Pressable>
          <Text style={styles.note}>{t.squareNote}</Text>
        </View>
      )}
    </ScrollView>
  );

  const renderAccount = () => (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.accountCard}>
        <Text style={styles.accountIcon}>👤</Text>
        <Text style={styles.pageTitle}>{t.accountTitle}</Text>
        <Text style={styles.bodyText}>{t.accountText}</Text>
      </View>
    </ScrollView>
  );

  const screen = { home: renderHome, shop: renderShop, custom: renderCustom, cart: renderCart, account: renderAccount }[tab];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.deepRed} />
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>{t.brand}</Text>
          <Text style={styles.tagline}>{t.tagline}</Text>
        </View>
        <Pressable style={styles.langButton} onPress={() => setLang(lang === "en" ? "km" : "en")}>
          <Text style={styles.langText}>{lang === "en" ? "ខ្មែរ" : "EN"}</Text>
        </Pressable>
      </View>

      <View style={styles.content}>{screen()}</View>

      <View style={styles.nav}>
        {[
          ["home", "⌂", t.home],
          ["shop", "▦", t.shop],
          ["custom", "✦", t.custom],
          ["cart", "🛒", `${t.cart}${cartCount ? ` (${cartCount})` : ""}`],
          ["account", "◉", t.account],
        ].map(([key, icon, label]) => (
          <Pressable key={key} style={styles.navItem} onPress={() => setTab(key)}>
            <Text style={[styles.navIcon, tab === key && styles.navActive]}>{icon}</Text>
            <Text numberOfLines={1} style={[styles.navLabel, tab === key && styles.navActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.deepRed },
  header: {
    backgroundColor: COLORS.deepRed, paddingHorizontal: 18, paddingVertical: 12,
    flexDirection: "row", alignItems: "center", justifyContent: "space-between"
  },
  brand: { color: COLORS.gold, fontSize: 20, fontWeight: "900", letterSpacing: 1 },
  tagline: { color: COLORS.white, fontSize: 11, marginTop: 2, opacity: 0.9 },
  langButton: { borderWidth: 1, borderColor: COLORS.gold, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18 },
  langText: { color: COLORS.gold, fontWeight: "800" },
  content: { flex: 1, backgroundColor: COLORS.cream },
  scroll: { padding: 16, paddingBottom: 30 },
  hero: { backgroundColor: COLORS.red, borderRadius: 22, padding: 22, marginBottom: 22, alignItems: "flex-start" },
  heroBadge: { fontSize: 42, marginBottom: 8 },
  heroTitle: { color: COLORS.gold, fontSize: 28, fontWeight: "900", lineHeight: 32 },
  heroText: { color: COLORS.white, marginTop: 8, lineHeight: 21, fontSize: 15 },
  heroButton: { backgroundColor: COLORS.gold, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, marginTop: 16 },
  heroButtonText: { color: COLORS.deepRed, fontWeight: "900", fontSize: 16 },
  sectionTitle: { fontSize: 22, fontWeight: "900", color: COLORS.deepRed, marginBottom: 12 },
  pageTitle: { fontSize: 26, fontWeight: "900", color: COLORS.deepRed, marginBottom: 10 },
  bodyText: { color: COLORS.ink, fontSize: 15, lineHeight: 22, marginBottom: 18 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: { width: "48%", backgroundColor: COLORS.white, borderRadius: 16, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: COLORS.line },
  productImage: { height: 105, borderRadius: 12, backgroundColor: "#F6E8CD", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  emoji: { fontSize: 48 },
  productName: { color: COLORS.ink, fontWeight: "800", minHeight: 40 },
  price: { color: COLORS.red, fontWeight: "900", fontSize: 17, marginVertical: 6 },
  goldButton: { backgroundColor: COLORS.gold, paddingVertical: 9, borderRadius: 10, alignItems: "center" },
  goldButtonText: { color: COLORS.deepRed, fontWeight: "900", fontSize: 12 },
  input: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 13, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, marginBottom: 12, color: COLORS.ink },
  textarea: { minHeight: 130, textAlignVertical: "top" },
  primaryButton: { backgroundColor: COLORS.red, borderRadius: 13, paddingVertical: 14, alignItems: "center" },
  primaryButtonText: { color: COLORS.white, fontWeight: "900", fontSize: 16 },
  cartRow: { backgroundColor: COLORS.white, borderRadius: 15, borderWidth: 1, borderColor: COLORS.line, padding: 12, marginBottom: 10, flexDirection: "row", alignItems: "center" },
  cartEmoji: { fontSize: 38, marginRight: 12 },
  cartName: { fontWeight: "800", color: COLORS.ink },
  qtyBox: { flexDirection: "row", alignItems: "center" },
  qtyButton: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#F4E6CC", alignItems: "center", justifyContent: "center" },
  qtyText: { fontSize: 20, color: COLORS.deepRed, fontWeight: "900" },
  qtyNumber: { width: 28, textAlign: "center", fontWeight: "900", color: COLORS.ink },
  checkoutBox: { marginTop: 10, backgroundColor: COLORS.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.line },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  totalLabel: { fontWeight: "800", color: COLORS.ink, fontSize: 18 },
  total: { fontWeight: "900", color: COLORS.red, fontSize: 22 },
  squareButton: { backgroundColor: "#111111", paddingVertical: 15, borderRadius: 12, alignItems: "center" },
  squareButtonText: { color: COLORS.white, fontWeight: "900", fontSize: 16 },
  note: { color: COLORS.muted, fontSize: 12, lineHeight: 17, marginTop: 10 },
  accountCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, alignItems: "center", borderWidth: 1, borderColor: COLORS.line },
  accountIcon: { fontSize: 58, marginBottom: 10 },
  nav: { flexDirection: "row", backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.line, paddingVertical: 7 },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 2 },
  navIcon: { fontSize: 20, color: COLORS.muted, fontWeight: "900" },
  navLabel: { fontSize: 9, color: COLORS.muted, marginTop: 3, fontWeight: "700" },
  navActive: { color: COLORS.red },
});
