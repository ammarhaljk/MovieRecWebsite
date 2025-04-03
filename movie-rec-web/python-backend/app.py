from flask import Flask, request, jsonify
from flask_cors import CORS
import recommend_content

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        if not data or 'email' not in data:
            return jsonify({"success": False, "message": "Invalid request"}), 400
        
        email = data['email']
        n = data.get('n', 5)  # Default to 5 recommendations if not specified
        
        # Call the content-based recommendation function
        recommendations = recommend_content.recommend_movies(email, n)
        
        if recommendations["success"]:
            return jsonify({"success": True, "recommendations": recommendations["recommendations"]})
        else:
            return jsonify({"success": False, "message": recommendations["message"]}), 404
    
    except Exception as e:
        print(f"Error in /recommend route: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
