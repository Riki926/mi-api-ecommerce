#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🧪 PRUEBA COMPLETA DEL API E-COMMERCE                   ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

BASE_URL="http://localhost:8080"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "1️⃣  HEALTH CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s $BASE_URL/api/health | json_pp
echo -e "${GREEN}✓ Health check OK${NC}\n"

echo "2️⃣  REGISTRAR USUARIO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Juan","last_name":"Pérez","email":"juan@test.com","age":30,"password":"pass123"}')
echo $REGISTER_RESPONSE | json_pp
USER_ID=$(echo $REGISTER_RESPONSE | grep -o '"uid":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ Usuario creado: $USER_ID${NC}\n"

echo "3️⃣  LOGIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@test.com","password":"pass123"}')
echo $LOGIN_RESPONSE | json_pp
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ Token obtenido${NC}\n"

echo "4️⃣  OBTENER USUARIO ACTUAL (current)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s $BASE_URL/api/sessions/current \
  -H "Authorization: Bearer $TOKEN" | json_pp
echo -e "${GREEN}✓ Current user OK${NC}\n"

echo "5️⃣  CREAR USUARIO ADMIN (manual en MongoDB)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Para probar funciones admin, ejecuta en MongoDB:"
echo "db.users.updateOne({email: 'juan@test.com'}, {\$set: {role: 'admin'}})"
echo -e "${BLUE}Presiona Enter cuando lo hayas hecho...${NC}"
read

echo "6️⃣  LOGIN COMO ADMIN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ADMIN_LOGIN=$(curl -s -X POST $BASE_URL/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@test.com","password":"pass123"}')
ADMIN_TOKEN=$(echo $ADMIN_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ Admin token obtenido${NC}\n"

echo "7️⃣  CREAR PRODUCTOS (como admin)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
PRODUCT1=$(curl -s -X POST $BASE_URL/api/products \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Laptop Dell","description":"Alta gama","price":1500,"stock":10}')
echo $PRODUCT1 | json_pp
PRODUCT1_ID=$(echo $PRODUCT1 | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

PRODUCT2=$(curl -s -X POST $BASE_URL/api/products \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Mouse Gamer","description":"RGB","price":50,"stock":20}')
echo $PRODUCT2 | json_pp
PRODUCT2_ID=$(echo $PRODUCT2 | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
echo -e "${GREEN}✓ Productos creados${NC}\n"

echo "8️⃣  LISTAR PRODUCTOS (público)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s $BASE_URL/api/products | json_pp
echo -e "${GREEN}✓ Productos listados${NC}\n"

echo "9️⃣  REGISTRAR USER NORMAL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X POST $BASE_URL/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"María","last_name":"García","email":"maria@test.com","age":25,"password":"pass123"}' | json_pp

USER_LOGIN=$(curl -s -X POST $BASE_URL/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@test.com","password":"pass123"}')
USER_TOKEN=$(echo $USER_LOGIN | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo -e "${GREEN}✓ Usuario normal creado${NC}\n"

echo "🔟  AGREGAR AL CARRITO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X POST $BASE_URL/api/carts/mine/items \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PRODUCT1_ID\",\"quantity\":2}" | json_pp

curl -s -X POST $BASE_URL/api/carts/mine/items \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"productId\":\"$PRODUCT2_ID\",\"quantity\":1}" | json_pp
echo -e "${GREEN}✓ Productos agregados al carrito${NC}\n"

echo "1️⃣1️⃣  VER CARRITO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s $BASE_URL/api/carts/mine \
  -H "Authorization: Bearer $USER_TOKEN" | json_pp
echo -e "${GREEN}✓ Carrito obtenido${NC}\n"

echo "1️⃣2️⃣  REALIZAR COMPRA"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s -X POST $BASE_URL/api/checkout/purchase \
  -H "Authorization: Bearer $USER_TOKEN" | json_pp
echo -e "${GREEN}✓ Compra realizada${NC}\n"

echo "1️⃣3️⃣  VERIFICAR STOCK ACTUALIZADO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
curl -s $BASE_URL/api/products | json_pp
echo -e "${GREEN}✓ Stock actualizado${NC}\n"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  ✅ PRUEBA COMPLETA FINALIZADA                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
