#!/usr/bin/env node

/**
 * Test script for JWT Authentication API
 * Run with: node test-auth.js (from the project root)
 */

const BASE_URL = "http://localhost:3000";

async function testAuth() {
  console.log("🧪 Testing JWT Authentication API...\n");

  try {
    // Test 1: Register a new user
    console.log("1️⃣ Testing user registration...");
    const registerResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "John Doe",
        email: `test${Date.now()}@example.com`,
        password: "password123",
      }),
    });

    const registerData = await registerResponse.json();
    console.log(
      "✅ Registration:",
      registerData.success ? "SUCCESS" : "FAILED"
    );

    if (!registerData.success) {
      console.log("❌ Error:", registerData.error);
      return;
    }

    const { token, user } = registerData.data;
    console.log("👤 User created:", user.name, `(${user.email})`);
    console.log("🔑 Token received:", token.substring(0, 20) + "...\n");

    // Test 2: Get user profile (protected route)
    console.log("2️⃣ Testing protected route...");
    const profileResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const profileData = await profileResponse.json();
    console.log(
      "✅ Profile fetch:",
      profileData.success ? "SUCCESS" : "FAILED"
    );

    if (profileData.success) {
      console.log(
        "👤 Profile:",
        profileData.data.user.name,
        `(${profileData.data.user.email})\n`
      );
    }

    // Test 3: Login with the same user
    console.log("3️⃣ Testing user login...");
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        password: "password123",
      }),
    });

    const loginData = await loginResponse.json();
    console.log("✅ Login:", loginData.success ? "SUCCESS" : "FAILED");

    if (loginData.success) {
      console.log(
        "🔑 New token received:",
        loginData.data.token.substring(0, 20) + "...\n"
      );
    }

    // Test 4: Token verification
    console.log("4️⃣ Testing token verification...");
    const verifyResponse = await fetch(`${BASE_URL}/api/auth/verify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const verifyData = await verifyResponse.json();
    console.log(
      "✅ Token verification:",
      verifyData.success ? "SUCCESS" : "FAILED"
    );

    // Test 5: Invalid token
    console.log("\n5️⃣ Testing invalid token...");
    const invalidResponse = await fetch(`${BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: "Bearer invalid-token",
        "Content-Type": "application/json",
      },
    });

    const invalidData = await invalidResponse.json();
    console.log(
      "✅ Invalid token handling:",
      !invalidData.success ? "SUCCESS" : "FAILED"
    );

    if (!invalidData.success) {
      console.log("❌ Expected error:", invalidData.error);
    }

    console.log("\n🎉 All tests completed!");
  } catch (error) {
    console.error("💥 Test failed:", error.message);
    console.log(
      "\n💡 Make sure the Next.js development server is running: npm run dev"
    );
  }
}

if (require.main === module) {
  testAuth();
}

module.exports = testAuth;
