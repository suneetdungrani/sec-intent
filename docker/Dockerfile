FROM node:18-slim

WORKDIR /workspace

# Install Python and other tools for testing
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install development tools
RUN npm install -g typescript eslint prettier

# Create non-root user
RUN useradd -m -u 1000 testuser && chown -R testuser:testuser /workspace
USER testuser

CMD ["/bin/bash"]