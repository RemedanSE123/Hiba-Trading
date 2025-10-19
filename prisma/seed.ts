import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (optional - be careful in production)
  console.log('🗑️ Clearing existing data...')
  await prisma.productReview.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.address.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Create Admin User
  console.log('👤 Creating admin user...')
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@hiba.co.za',
      password: adminPassword,
      emailVerified: new Date(),
      role: 'ADMIN',
      phone: '+27821234567'
    }
  })

  // Create Test Customer
  console.log('👥 Creating test customer...')
  const customerPassword = await hash('customer123', 12)
  const customer = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: customerPassword,
      emailVerified: new Date(),
      role: 'CUSTOMER',
      phone: '+27827654321'
    }
  })

  // Create Categories
  console.log('📁 Creating categories...')
  const categories = await prisma.category.createMany({
    data: [
      {
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest smartphones and mobile devices',
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'Laptops',
        slug: 'laptops',
        description: 'Powerful laptops for work and gaming',
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'Tablets',
        slug: 'tablets',
        description: 'Versatile tablets for entertainment and productivity',
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Phone cases, chargers, and other accessories',
        isActive: true,
        sortOrder: 4
      },
      {
        name: 'Audio',
        slug: 'audio',
        description: 'Headphones, earphones, and speakers',
        isActive: true,
        sortOrder: 5
      }
    ]
  })

  // Get category IDs
  const smartphoneCategory = await prisma.category.findFirst({ where: { slug: 'smartphones' } })
  const laptopCategory = await prisma.category.findFirst({ where: { slug: 'laptops' } })
  const tabletCategory = await prisma.category.findFirst({ where: { slug: 'tablets' } })
  const accessoriesCategory = await prisma.category.findFirst({ where: { slug: 'accessories' } })
  const audioCategory = await prisma.category.findFirst({ where: { slug: 'audio' } })

  // Create Products
  console.log('📦 Creating products...')
  const products = await prisma.product.createMany({
    data: [
      // Smartphones
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        price: 24999.99,
        comparePrice: 26999.99,
        costPrice: 18000.00,
        sku: 'SAMSUNG-S24-ULTRA',
        barcode: '8806094671234',
        stock: 15,
        lowStockAlert: 3,
        images: JSON.stringify(['/uploads/products/s24-ultra-1.jpg', '/uploads/products/s24-ultra-2.jpg']),
        description: 'The ultimate smartphone with S Pen, Pro-grade camera, and powerful AI features.',
        features: JSON.stringify(['200MP Camera', 'S Pen Included', '5000mAh Battery', 'AI Features', '7 Years Updates']),
        isActive: true,
        isFeatured: true,
        weight: 0.232,
        dimensions: JSON.stringify({ length: 16.25, width: 7.87, height: 0.86 }),
        categoryId: smartphoneCategory!.id
      },
      {
        name: 'iPhone 15 Pro Max',
        slug: 'iphone-15-pro-max',
        price: 28999.99,
        comparePrice: 30999.99,
        costPrice: 21000.00,
        sku: 'APPLE-IP15-PROMAX',
        barcode: '1942530849123',
        stock: 12,
        lowStockAlert: 2,
        images: JSON.stringify(['/uploads/products/iphone15-pro-1.jpg', '/uploads/products/iphone15-pro-2.jpg']),
        description: 'The most powerful iPhone with titanium design and advanced camera system.',
        features: JSON.stringify(['Titanium Design', 'A17 Pro Chip', '5x Telephoto', 'Action Button', 'USB-C']),
        isActive: true,
        isFeatured: true,
        weight: 0.221,
        dimensions: JSON.stringify({ length: 16.07, width: 7.81, height: 0.83 }),
        categoryId: smartphoneCategory!.id
      },
      {
        name: 'Google Pixel 8 Pro',
        slug: 'google-pixel-8-pro',
        price: 18999.99,
        comparePrice: 20999.99,
        costPrice: 14000.00,
        sku: 'GOOGLE-PIXEL8-PRO',
        barcode: '8172400212345',
        stock: 8,
        lowStockAlert: 2,
        images: JSON.stringify(['/uploads/products/pixel8-pro-1.jpg', '/uploads/products/pixel8-pro-2.jpg']),
        description: 'Google\'s flagship with advanced AI features and exceptional camera performance.',
        features: JSON.stringify(['Tensor G3 Chip', 'Super Actua Display', 'Magic Editor', '7 Years Updates', 'Temperature Sensor']),
        isActive: true,
        isFeatured: false,
        weight: 0.213,
        dimensions: JSON.stringify({ length: 16.25, width: 7.69, height: 0.88 }),
        categoryId: smartphoneCategory!.id
      },
      {
        name: 'Xiaomi 13T Pro',
        slug: 'xiaomi-13t-pro',
        price: 14999.99,
        comparePrice: 16999.99,
        costPrice: 11000.00,
        sku: 'XIAOMI-13T-PRO',
        barcode: '6934177709876',
        stock: 20,
        lowStockAlert: 5,
        images: JSON.stringify(['/uploads/products/xiaomi-13t-1.jpg', '/uploads/products/xiaomi-13t-2.jpg']),
        description: 'Leica-engineered camera system with powerful performance.',
        features: JSON.stringify(['Leica Camera', 'Dimensity 9200+', '120W Charging', '144Hz Display', 'IP68 Rating']),
        isActive: true,
        isFeatured: true,
        weight: 0.206,
        dimensions: JSON.stringify({ length: 16.22, width: 7.49, height: 0.86 }),
        categoryId: smartphoneCategory!.id
      },

      // Laptops
      {
        name: 'MacBook Pro 16" M3 Max',
        slug: 'macbook-pro-16-m3-max',
        price: 65999.99,
        comparePrice: 69999.99,
        costPrice: 52000.00,
        sku: 'APPLE-MBP16-M3MAX',
        barcode: '1942537777777',
        stock: 6,
        lowStockAlert: 1,
        images: JSON.stringify(['/uploads/products/macbook-pro-1.jpg', '/uploads/products/macbook-pro-2.jpg']),
        description: 'The most powerful MacBook Pro for extreme performance workloads.',
        features: JSON.stringify(['M3 Max Chip', '16-inch Liquid Retina XDR', '128GB RAM', '8TB SSD', '40-core GPU']),
        isActive: true,
        isFeatured: true,
        weight: 2.16,
        dimensions: JSON.stringify({ length: 35.57, width: 24.81, height: 1.68 }),
        categoryId: laptopCategory!.id
      },
      {
        name: 'Dell XPS 15',
        slug: 'dell-xps-15',
        price: 34999.99,
        comparePrice: 38999.99,
        costPrice: 28000.00,
        sku: 'DELL-XPS15-9530',
        barcode: '8841163751234',
        stock: 10,
        lowStockAlert: 2,
        images: JSON.stringify(['/uploads/products/dell-xps-1.jpg', '/uploads/products/dell-xps-2.jpg']),
        description: 'Premium Windows laptop with stunning InfinityEdge display.',
        features: JSON.stringify(['Intel Core i9', 'RTX 4070', 'OLED 3.5K Display', '64GB RAM', '2TB SSD']),
        isActive: true,
        isFeatured: false,
        weight: 1.86,
        dimensions: JSON.stringify({ length: 34.44, width: 23.02, height: 1.85 }),
        categoryId: laptopCategory!.id
      },

      // Tablets
      {
        name: 'iPad Pro 12.9" M2',
        slug: 'ipad-pro-12-9-m2',
        price: 27999.99,
        comparePrice: 29999.99,
        costPrice: 21000.00,
        sku: 'APPLE-IPADPRO-M2',
        barcode: '1942538888888',
        stock: 8,
        lowStockAlert: 2,
        images: JSON.stringify(['/uploads/products/ipad-pro-1.jpg', '/uploads/products/ipad-pro-2.jpg']),
        description: 'The ultimate iPad experience with M2 chip and Liquid Retina XDR display.',
        features: JSON.stringify(['M2 Chip', 'Liquid Retina XDR', '5G Connectivity', 'Apple Pencil Support', 'Thunderbolt']),
        isActive: true,
        isFeatured: true,
        weight: 0.682,
        dimensions: JSON.stringify({ length: 28.06, width: 21.49, height: 0.64 }),
        categoryId: tabletCategory!.id
      },

      // Accessories
      {
        name: 'Silicone Phone Case - Black',
        slug: 'silicone-phone-case-black',
        price: 499.99,
        comparePrice: 699.99,
        costPrice: 250.00,
        sku: 'CASE-SILICONE-BLK',
        barcode: '1234567890123',
        stock: 50,
        lowStockAlert: 10,
        images: JSON.stringify(['/uploads/products/case-silicone-1.jpg']),
        description: 'Premium silicone case with soft-touch finish and raised edges for screen protection.',
        features: JSON.stringify(['Soft-Touch Finish', 'Raised Edges', 'Wireless Charging Compatible', 'Multiple Colors']),
        isActive: true,
        isFeatured: false,
        weight: 0.035,
        dimensions: JSON.stringify({ length: 16, width: 8, height: 0.3 }),
        categoryId: accessoriesCategory!.id
      },

      // Audio
      {
        name: 'Sony WH-1000XM5 Headphones',
        slug: 'sony-wh-1000xm5-headphones',
        price: 6999.99,
        comparePrice: 7999.99,
        costPrice: 4500.00,
        sku: 'SONY-WH1000XM5',
        barcode: '4905524931234',
        stock: 15,
        lowStockAlert: 3,
        images: JSON.stringify(['/uploads/products/sony-xm5-1.jpg', '/uploads/products/sony-xm5-2.jpg']),
        description: 'Industry-leading noise cancellation with exceptional sound quality.',
        features: JSON.stringify(['Industry-Leading ANC', '30-hour Battery', 'Quick Charge', 'Touch Controls', 'Hi-Res Audio']),
        isActive: true,
        isFeatured: true,
        weight: 0.250,
        dimensions: JSON.stringify({ length: 20.7, width: 16.5, height: 7.3 }),
        categoryId: audioCategory!.id
      }
    ]
  })

  // Create Address for Customer
  console.log('🏠 Creating customer address...')
  const address = await prisma.address.create({
    data: {
      fullName: 'John Doe',
      phone: '+27827654321',
      province: 'Gauteng',
      city: 'Johannesburg',
      suburb: 'Sandton',
      streetAddress: '123 Main Road',
      unitNumber: 'Unit 5B',
      postalCode: '2196',
      isDefault: true,
      type: 'HOME',
      userId: customer.id
    }
  })

  // Create Sample Orders
  console.log('📋 Creating sample orders...')
  const productsList = await prisma.product.findMany({ take: 3 })
  
  const order = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}`,
      totalPrice: 48999.97,
      subtotal: 48999.97,
      taxAmount: 6859.99,
      shippingFee: 150.00,
      discountAmount: 2000.00,
      status: 'DELIVERED',
      paymentMethod: 'BANK_TRANSFER',
      shippingMethod: 'COURIER',
      trackingNumber: 'TRK123456789ZA',
      notes: 'Left at reception',
      paidAt: new Date('2024-01-15'),
      shippedAt: new Date('2024-01-16'),
      deliveredAt: new Date('2024-01-18'),
      userId: customer.id,
      addressId: address.id,
      orderItems: {
        create: [
          {
            quantity: 1,
            price: 24999.99,
            total: 24999.99,
            productId: productsList[0].id
          },
          {
            quantity: 1,
            price: 14999.99,
            total: 14999.99,
            productId: productsList[2].id
          },
          {
            quantity: 2,
            price: 499.99,
            total: 999.99,
            productId: productsList[3]?.id || productsList[0].id
          }
        ]
      }
    }
  })

  // Create Product Reviews
  console.log('⭐ Creating product reviews...')
  await prisma.productReview.create({
    data: {
      rating: 5,
      title: 'Excellent phone!',
      comment: 'The camera quality is amazing and battery life lasts all day. Highly recommended!',
      isVerified: true,
      isHelpful: 12,
      userId: customer.id,
      productId: productsList[0].id
    }
  })

  console.log('✅ Database seeding completed successfully!')
  console.log('📊 Created:')
  console.log('   - 2 Users (Admin + Customer)')
  console.log('   - 5 Categories')
  console.log('   - 9 Products')
  console.log('   - 1 Address')
  console.log('   - 1 Sample Order')
  console.log('   - 1 Product Review')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })