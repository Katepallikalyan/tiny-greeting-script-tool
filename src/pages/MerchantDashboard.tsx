
import React, { useState, useEffect } from "react";
import { Search, Filter, ShoppingCart, User, Star, Truck, CheckCircle, Wallet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { CertificationBadge } from "@/components/ui/certification-badge";
import { useProductCertification } from "@/hooks/useCertifications";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  price_per_ton?: number;
  quantity_tons?: number;
  unit: string;
  image?: string;
  organic: boolean;
  seasonal: boolean;
  featured: boolean;
  farmer_id: string;
  farmers: {
    id: string;
    name: string;
    location: string;
    rating?: number;
  };
}

const ProductCard = ({ product }: { product: Product }) => {
  const { certification } = useProductCertification(product.id);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={product.image || "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=300"}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
        {product.organic && (
          <Badge className="absolute top-2 left-2 bg-green-100 text-green-800">
            Organic
          </Badge>
        )}
        {certification && (
          <div className="absolute top-2 right-2">
            <CertificationBadge certification={certification} type="product" size="sm" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <div className="text-right">
            <div className="font-bold text-green-700">₹{product.price}/{product.unit}</div>
            {product.price_per_ton && (
              <div className="text-sm text-gray-500">₹{product.price_per_ton}/ton</div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description || "Fresh produce from verified farmers"}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{product.farmers.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{product.farmers.rating || 4.5}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            <Truck className="w-4 h-4 inline mr-1" />
            {product.farmers.location}
          </span>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const MerchantDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCertifiedOnly, setShowCertifiedOnly] = useState(false);
  const [showOrganicOnly, setShowOrganicOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState(5000); // Mock wallet balance

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, showCertifiedOnly, showOrganicOnly]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          farmers (
            id,
            name,
            location,
            rating
          )
        `)
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setProducts(data as Product[]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = async () => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmers.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.farmers.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Organic filter
    if (showOrganicOnly) {
      filtered = filtered.filter(product => product.organic);
    }

    // Certified filter
    if (showCertifiedOnly) {
      const certifiedProductIds = new Set();
      const certifiedFarmerIds = new Set();

      // Get certified products and farmers
      const { data: certifications } = await supabase
        .from('certifications')
        .select('farmer_id, product_id')
        .eq('status', 'approved');

      if (certifications) {
        certifications.forEach(cert => {
          if (cert.product_id) certifiedProductIds.add(cert.product_id);
          if (cert.farmer_id) certifiedFarmerIds.add(cert.farmer_id);
        });
      }

      filtered = filtered.filter(product =>
        certifiedProductIds.has(product.id) || certifiedFarmerIds.has(product.farmer_id)
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddMoney = () => {
    // Mock add money functionality
    const amount = prompt("Enter amount to add:");
    if (amount && !isNaN(Number(amount))) {
      setWalletBalance(prev => prev + Number(amount));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Farm Bridge Marketplace</h1>
            <div className="flex items-center gap-4">
              {/* Wallet Section */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-sm font-medium text-green-900">
                          ₹{walletBalance.toLocaleString()}
                        </div>
                        <div className="text-xs text-green-600">Wallet Balance</div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={handleAddMoney}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full px-3 py-1"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Button variant="outline" size="sm">
                <ShoppingCart className="w-4 h-4 mr-1" />
                Cart (0)
              </Button>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-1" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search products, farmers, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certified"
                    checked={showCertifiedOnly}
                    onCheckedChange={(checked) => setShowCertifiedOnly(checked === true)}
                  />
                  <label htmlFor="certified" className="text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Certified Only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="organic"
                    checked={showOrganicOnly}
                    onCheckedChange={(checked) => setShowOrganicOnly(checked === true)}
                  />
                  <label htmlFor="organic" className="text-sm font-medium">
                    Organic Only
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            {filteredProducts.length} Products Found
          </h2>
          {(showCertifiedOnly || showOrganicOnly || searchTerm) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setShowCertifiedOnly(false);
                setShowOrganicOnly(false);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No products found</div>
            <div className="text-gray-400">Try adjusting your search or filters</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;
