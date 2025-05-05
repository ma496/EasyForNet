#!/bin/bash

# Exit on error
set -e

# Clean previous packages
echo "Cleaning previous packages..."
rm -f Tool/FastEndpointsTool/bin/Release/*.nupkg

# Get latest Git tag for versioning
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "1.1.0")
LAST_TAG=${LAST_TAG#v}
# Increment patch version
MAJOR=$(echo $LAST_TAG | cut -d. -f1)
MINOR=$(echo $LAST_TAG | cut -d. -f2)
PATCH=$(echo $LAST_TAG | cut -d. -f3)
PATCH=$((PATCH + 1))
VERSION="$MAJOR.$MINOR.$PATCH"

# Allow manual version override
read -p "Enter version [$VERSION]: " VERSION_OVERRIDE
VERSION=${VERSION_OVERRIDE:-$VERSION}

# Build and pack with version
echo "Building and packing version $VERSION..."
dotnet pack Tool/FastEndpointsTool/FastEndpointsTool.csproj -c Release /p:Version=$VERSION /p:PackageVersion=$VERSION

# Verify package exists
if ! ls Tool/FastEndpointsTool/bin/Release/*.nupkg 1> /dev/null 2>&1; then
    echo "Package was not created"
    exit 1
fi

# Confirm before publishing
read -p "Publish version $VERSION to NuGet? (y/N): " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Publishing cancelled"
    exit 0
fi

# Push to NuGet
echo "Publishing to NuGet..."
if [ -n "$NUGET_API_KEY" ]; then
    dotnet nuget push "Tool/FastEndpointsTool/bin/Release/*.nupkg" --source "https://api.nuget.org/v3/index.json" --api-key "$NUGET_API_KEY"
else
    dotnet nuget push "Tool/FastEndpointsTool/bin/Release/*.nupkg" --source "https://api.nuget.org/v3/index.json"
fi

# Create and push Git tag
echo "Creating Git tag v$VERSION..."
git tag "v$VERSION"
if ! git push origin "v$VERSION"; then
    echo "Warning: Failed to push Git tag"
fi

echo "Package published successfully!"