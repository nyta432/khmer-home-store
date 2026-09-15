import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  Linking,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

const PRODUCTS = [
  {
    id: "cambodia-angkor-shirt",
    name: "Cambodia Angkor Wat T-Shirt",
    category: "T-Shirts",
    price: 15,
    image: require("./C008B419-8663-4F31-8742-00CB0CF1384C.png"),
    options: ["S", "M", "L", "XL", "2XL"],
    colors: ["Black"],
    stock: { S: 5, M: 5, L: 5, XL: 5, "2XL": 5 },
  },
  {
    id: "shirt",
    name: "Custom Khmer T-Shirt",
    category: "T-Shirts",
    price: 15,
    icon: "👕",
    options: ["S", "M", "L", "XL", "2XL"],
    colors: ["Black", "White", "Red", "Navy", "Royal Blue", "Gray"],
  },
  {
    id: "case",
    name: "Khmer Phone Case",
    category: "Phone Cases",
    price: 12,
    image: require("./0CDF1AD7-040D-4E0A-BAA9-08DACA4014F9.png"),
    options: [
      "iPhone 11 Pro Max",
      "iPhone 12",
      "iPhone 13",
      "iPhone 14",
      "iPhone 15",
      "iPhone 16",
      "iPhone 17",
    ],
    colors: [],
  },
  {
    id: "tumbler",
    name: "20 oz Angkor Wat Tumbler",
    category: "Tumblers",
    price: 25,
    image: require("./IMG_0470.jpeg"),
    options: ["20 oz"],
    colors: [],
  },
  {
    id: "apron",
    name: "Khmer Apron",
    category: "Aprons",
    price: 15,
    icon: "👩‍🍳",
    options: ["One Size"],
    colors: ["Black", "White"],
  },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [customText, setCustomText] = useState("");
  const [customImage, setCustomImage] = useState(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedOption(product.options?.[0] || "");
    setSelectedColor(product.colors?.[0] || "");
    setPage("product");
  };

  const addToCart = () => {
    if (!selectedProduct) return;

    const key = `${selectedProduct.id}-${selectedOption}-${selectedColor}`;

    setCart((current) => {
      const existing = current.find((item) => item.key === key);

      if (existing) {
        return current.map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          key,
          ...selectedProduct,
          option: selectedOption,
          color: selectedColor,
          quantity: 1,
        },
      ];
    });

    Alert.alert("Added to Cart", selectedProduct.name);
  };

  const changeQuantity = (key, amount) => {
    setCart((current) =>
      current
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const pickCustomImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Needed", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setCustomImage(result.assets[0].uri);
    }
  };

  const ProductPicture = ({ product, large = false }) => {
    if (product.image) {
      return (
        <Image
          source={product.image}
          style={large ? styles.detailImage : styles.productImage}
        />
      );
    }

    return (
      <Text style={large ? styles.detailIcon : styles.productIcon}>
        {product.icon}
      </Text>
    );
  };

  const ProductCard = ({ product }) => (
    <Pressable
      style={styles.productCard}
      onPress={() => openProduct(product)}
    >
      <ProductPicture product={product} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productCategory}>{product.category}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </Pressable>
  );

  const Home = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Khmer Home Store</Text>

        <Text style={styles.heroText}>
          Khmer Designs • Custom Made • Made with Love 🇰🇭
        </Text>

        <Pressable
          style={styles.goldButton}
          onPress={() => setPage("catalog")}
        >
          <Text style={styles.goldButtonText}>Shop Now</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Featured Products</Text>

      <View style={styles.grid}>
        {PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>

      <View style={styles.entertainmentBox}>
        <Text style={styles.sectionTitle}>Entertainment 🎬</Text>

        <Text style={styles.normalText}>
          Watch Khmer 1001 Nights stories.
        </Text>

        <Pressable
          style={styles.youtubeButton}
          onPress={() =>
            Linking.openURL(
              "https://youtu.be/EyD4xanD9z4?is=hjxVCjM8PisXqQYN"
            )
          }
        >
          <Text style={styles.youtubeButtonText}>
            ▶ Watch on YouTube
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  const Catalog = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Shop Khmer Home Store</Text>

      <TextInput
        style={styles.input}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.grid}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </View>
    </ScrollView>
  );

  const ProductDetail = () => {
    if (!selectedProduct) return null;

    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => setPage("catalog")}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <View style={styles.detailBox}>
          <ProductPicture product={selectedProduct} large />

          <Text style={styles.detailTitle}>
            {selectedProduct.name}
          </Text>

          <Text style={styles.detailPrice}>
            ${selectedProduct.price}
          </Text>

          <Text style={styles.optionTitle}>Choose Size / Option:</Text>

          <View style={styles.optionWrap}>
            {selectedProduct.options.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.optionButton,
                  selectedOption === option &&
                    styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedOption(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === option &&
                      styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>

          {selectedProduct.colors?.length > 0 && (
            <>
              <Text style={styles.optionTitle}>Choose Color:</Text>

              <View style={styles.optionWrap}>
                {selectedProduct.colors.map((color) => (
                  <Pressable
                    key={color}
                    style={[
                      styles.optionButton,
                      selectedColor === color &&
                        styles.optionButtonSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedColor === color &&
                          styles.optionTextSelected,
                      ]}
                    >
                      {color}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          <Pressable style={styles.goldButton} onPress={addToCart}>
            <Text style={styles.goldButtonText}>Add to Cart</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  };

  const Custom = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Custom Order</Text>

      <View style={styles.customBox}>
        <Text style={styles.customTitle}>
          Create Something Special ✨
        </Text>

        <Text style={styles.normalText}>
          Choose your photo or design and tell us what you want customized.
        </Text>

        <Pressable
          style={styles.uploadButton}
          onPress={pickCustomImage}
        >
          <Text style={styles.uploadButtonText}>
            📷 Choose Photo / Design
          </Text>
        </Pressable>

        {customImage && (
          <View style={styles.previewBox}>
            <Image
              source={{ uri: customImage }}
              style={styles.customPreview}
            />

            <Text style={styles.uploadSuccess}>✓ Photo selected</Text>

            <Pressable onPress={() => setCustomImage(null)}>
              <Text style={styles.removeText}>Remove Photo</Text>
            </Pressable>
          </View>
        )}

        <TextInput
          style={[styles.input, styles.bigInput]}
          placeholder="Example: Black XL T-shirt with my name..."
          multiline
          value={customText}
          onChangeText={setCustomText}
        />

        <Pressable
          style={styles.goldButton}
          onPress={() =>
            Alert.alert(
              "Custom Request",
              customText || "Please enter your request."
            )
          }
        >
          <Text style={styles.goldButtonText}>Send Request</Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  const Cart = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Your Cart</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.normalText}>Your cart is empty.</Text>
        </View>
      ) : (
        <>
          {cart.map((item) => (
            <View key={item.key} style={styles.cartItem}>
              <View style={styles.cartPicture}>
                <ProductPicture product={item} />
              </View>

              <View style={styles.cartInfo}>
                <Text style={styles.cartName}>{item.name}</Text>

                <Text style={styles.productCategory}>
                  {item.option}
                  {item.color ? ` • ${item.color}` : ""}
                </Text>

                <Text style={styles.price}>${item.price}</Text>
              </View>

              <View style={styles.quantityBox}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => changeQuantity(item.key, -1)}
                >
                  <Text style={styles.quantityText}>−</Text>
                </Pressable>

                <Text style={styles.quantityNumber}>
                  {item.quantity}
                </Text>

                <Pressable
                  style={styles.quantityButton}
                  onPress={() => changeQuantity(item.key, 1)}
                >
                  <Text style={styles.quantityText}>+</Text>
                </Pressable>
              </View>
            </View>
          ))}

          <View style={styles.totalBox}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalPrice}>
              ${total.toFixed(2)}
            </Text>
          </View>

          <Pressable
            style={styles.goldButton}
            onPress={() =>
              Alert.alert(
                "Checkout",
                "Square payment will be connected later."
              )
            }
          >
            <Text style={styles.goldButtonText}>
              Proceed to Checkout
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );

  const Account = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>My Account</Text>

      <View style={styles.accountBox}>
        <Text style={styles.accountIcon}>👤</Text>

        <Text style={styles.customTitle}>
          Welcome to Khmer Home Store
        </Text>

        <Text style={styles.normalText}>
          Customer login and order history can be added later.
        </Text>
      </View>
    </ScrollView>
  );

  const renderPage = () => {
    if (page === "home") return <Home />;
    if (page === "catalog") return <Catalog />;
    if (page === "product") return <ProductDetail />;
    if (page === "custom") return <Custom />;
    if (page === "cart") return <Cart />;
    if (page === "account") return <Account />;

    return <Home />;
  };

  const Tab = ({ name, icon, label }) => (
    <Pressable style={styles.tab} onPress={() => setPage(name)}>
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text
        style={[
          styles.tabText,
          page === name && styles.activeTabText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>KHMER HOME STORE</Text>
        <Text style={styles.headerSub}>
          Proudly Khmer • Made with Love 🇰🇭
        </Text>
      </View>

      <View style={styles.main}>{renderPage()}</View>

      <View style={styles.bottomNav}>
        <Tab name="home" icon="🏠" label="Home" />
        <Tab name="catalog" icon="🛍️" label="Catalog" />
        <Tab name="custom" icon="✨" label="Custom" />
        <Tab name="cart" icon="🛒" label="Cart" />
        <Tab name="account" icon="👤" label="Account" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E8",
  },

  main: {
    flex: 1,
  },

  header: {
    backgroundColor: "#720817",
    paddingVertical: 14,
    paddingHorizontal: 15,
    alignItems: "center",
  },

  headerTitle: {
    color: "#FFD76A",
    fontSize: 21,
    fontWeight: "900",
  },

  headerSub: {
    color: "#FFFFFF",
    marginTop: 3,
    fontSize: 12,
  },

  content: {
    padding: 15,
    paddingBottom: 30,
  },

  hero: {
    backgroundColor: "#720817",
    padding: 22,
    borderRadius: 18,
    marginBottom: 20,
  },

  heroTitle: {
    color: "#FFD76A",
    fontSize: 28,
    fontWeight: "900",
  },

  heroText: {
    color: "#FFFFFF",
    marginVertical: 12,
    lineHeight: 22,
  },

  sectionTitle: {
    color: "#720817",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 15,
    marginBottom: 14,
  },

  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    resizeMode: "contain",
    marginBottom: 8,
  },

  productIcon: {
    fontSize: 58,
    textAlign: "center",
    marginVertical: 20,
  },

  productName: {
    fontWeight: "800",
    fontSize: 14,
  },

  productCategory: {
    color: "#777777",
    fontSize: 12,
    marginTop: 4,
  },

  price: {
    color: "#720817",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 5,
  },

  goldButton: {
    backgroundColor: "#E5B840",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
  },

  goldButtonText: {
    color: "#3D2500",
    fontWeight: "900",
    fontSize: 16,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    padding: 13,
    marginBottom: 15,
  },

  backText: {
    color: "#720817",
    fontWeight: "800",
    marginBottom: 12,
  },

  detailBox: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
  },

  detailImage: {
    width: "100%",
    height: 280,
    resizeMode: "contain",
  },

  detailIcon: {
    fontSize: 100,
    textAlign: "center",
  },

  detailTitle: {
    fontSize: 22,
    fontWeight: "900",
    marginTop: 10,
  },

  detailPrice: {
    color: "#720817",
    fontSize: 24,
    fontWeight: "900",
    marginVertical: 10,
  },

  optionTitle: {
    fontWeight: "800",
    marginTop: 12,
    marginBottom: 8,
  },

  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  optionButton: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 9,
    marginRight: 7,
    marginBottom: 7,
  },

  optionButtonSelected: {
    backgroundColor: "#720817",
    borderColor: "#720817",
  },

  optionText: {
    color: "#333333",
  },

  optionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  customBox: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
  },

  customTitle: {
    color: "#720817",
    fontSize: 19,
    fontWeight: "900",
    marginBottom: 8,
  },

  normalText: {
    color: "#555555",
    lineHeight: 21,
  },

  uploadButton: {
    backgroundColor: "#720817",
    padding: 13,
    borderRadius: 11,
    alignItems: "center",
    marginVertical: 15,
  },

  uploadButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  previewBox: {
    alignItems: "center",
    marginBottom: 15,
  },

  customPreview: {
    width: "100%",
    height: 230,
    resizeMode: "contain",
    borderRadius: 12,
  },

  uploadSuccess: {
    color: "green",
    fontWeight: "800",
    marginTop: 5,
  },

  removeText: {
    color: "#A00000",
    marginTop: 7,
  },

  bigInput: {
    minHeight: 110,
    textAlignVertical: "top",
  },

  emptyBox: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    alignItems: "center",
    borderRadius: 18,
  },

  emptyIcon: {
    fontSize: 55,
  },

  cartItem: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  cartPicture: {
    width: 70,
  },

  cartInfo: {
    flex: 1,
    paddingHorizontal: 8,
  },

  cartName: {
    fontWeight: "900",
  },

  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F0E4CC",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityText: {
    fontSize: 20,
    fontWeight: "900",
  },

  quantityNumber: {
    paddingHorizontal: 8,
    fontWeight: "800",
  },

  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
  },

  totalText: {
    fontSize: 20,
    fontWeight: "900",
  },

  totalPrice: {
    color: "#720817",
    fontSize: 22,
    fontWeight: "900",
  },

  accountBox: {
    backgroundColor: "#FFFFFF",
    padding: 25,
    borderRadius: 18,
    alignItems: "center",
  },

  accountIcon: {
    fontSize: 70,
    marginBottom: 10,
  },

  entertainmentBox: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    marginTop: 10,
  },

  youtubeButton: {
    backgroundColor: "#720817",
    padding: 13,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  youtubeButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingVertical: 7,
  },

  tab: {
    flex: 1,
    alignItems: "center",
  },

  tabIcon: {
    fontSize: 20,
  },

  tabText: {
    fontSize: 10,
    color: "#777777",
    marginTop: 2,
  },

  activeTabText: {
    color: "#720817",
    fontWeight: "900",
  },
});
