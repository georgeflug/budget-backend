package com.georgeflug.budget.api.okhttp

// see: https://github.com/square/okhttp/blob/master/samples/guide/src/main/java/okhttp3/recipes/CustomTrust.java

import java.io.InputStream
import java.security.KeyStore
import java.security.cert.Certificate
import java.security.cert.CertificateFactory
import javax.net.ssl.TrustManagerFactory
import javax.net.ssl.X509TrustManager

class CustomTrustManager {
    private val budgetBackendCert = """
            -----BEGIN CERTIFICATE-----
            MIIDejCCAmICCQDBpPAvrVAiPDANBgkqhkiG9w0BAQsFADB/MQswCQYDVQQGEwJV
            UzELMAkGA1UECAwCTU8xEjAQBgNVBAcMCVN0LiBMb3VpczERMA8GA1UECgwITW9t
            ZW50dW0xFzAVBgNVBAMMDmJ1ZGdldC1iYWNrZW5kMSMwIQYJKoZIhvcNAQkBFhRn
            ZW9yZ2VmbHVnQGdtYWlsLmNvbTAeFw0xOTAyMjcxMzI2NTFaFw0yOTAyMjQxMzI2
            NTFaMH8xCzAJBgNVBAYTAlVTMQswCQYDVQQIDAJNTzESMBAGA1UEBwwJU3QuIExv
            dWlzMREwDwYDVQQKDAhNb21lbnR1bTEXMBUGA1UEAwwOYnVkZ2V0LWJhY2tlbmQx
            IzAhBgkqhkiG9w0BCQEWFGdlb3JnZWZsdWdAZ21haWwuY29tMIIBIjANBgkqhkiG
            9w0BAQEFAAOCAQ8AMIIBCgKCAQEAptf6VBCnu02gc+Hwv1lG/c8I19vM2nrztHq+
            t9xQMW9eHqKZPM9R1ZGoNi79idGiyS3aDZ85h4auXSn8P58PGsMWn+P6wa2nYoDv
            t+JbRaiMs2tCo2RITZG4bVbJkYWV5RzEjLWwyDv52HLd5M16NSQy0uZ1hnek3tb8
            Iq8P4nbjRw7WbzgDgEFdWu/9x0rCw6DO/PsMcpBoWH0r7p7bhgDXLxbYu6gaWEwr
            Qm6tQwnHeAhVp4OVkpGWCqKAQFAA46H/Iig/loI7EzrqrmXBHeNSKlrwNk0uR3KF
            qN9ReBxoa6gjBSygnU98VHbgbBU1K2LnV/FGG2xCVYuOadSxQQIDAQABMA0GCSqG
            SIb3DQEBCwUAA4IBAQATYs9O2ZmUeLQ3X2GETL9dofOsFSDWqQFp7H9PNU9EYI3V
            WzmGcy1OR7C53Wfb1FoRc9/k7IeBULu7wHcKbxJDTPq2VJOER0MNbj5Z5K1WNYDe
            VKG5jQp788LQjCwI8qA9gOs/dgccRHg8gjt3qsBHwC7CkXg5HKXrx0SfD5A0yhm/
            qkcmbiRAz8vSmxjjqAYQ17FC38Q9Pq0EiKqurtsw2aIOimLlrLEurVEqeT0bHqNd
            rsUgQ3vV2gj43ZEutVhYx/PKnyH2UNhGWYW8h9biWSPv/2MqQxw2IfEUvZIIxF8E
            KJQfcAmeWfb2HNiTk440VL5VNaspU/DQAiFyFXAt
            -----END CERTIFICATE-----
            """.trimIndent()

    fun createTrustManager(): X509TrustManager {
        val certificate = createCert()
        val keyStore = createKeyStore(certificate)
        return createTrustManager(keyStore)
    }

    private fun createCert(): Certificate {
        val certificateFactory = CertificateFactory.getInstance("X.509")
        val certificates = certificateFactory.generateCertificates(budgetBackendCert.byteInputStream())
        return certificates.first()
    }

    private fun createKeyStore(certificate: Certificate): KeyStore {
        val certificateAlias = "budget-backend"
        val keyStore = createEmptyKeystore()
        keyStore.setCertificateEntry(certificateAlias, certificate)
        return keyStore
    }

    private fun createEmptyKeystore(): KeyStore {
        val keyStore = KeyStore.getInstance(KeyStore.getDefaultType())
        val inputStream: InputStream? = null // by convention, 'null' creates an empty key store.
        val password = "password".toCharArray() // does not matter
        keyStore.load(inputStream, password)
        return keyStore
    }

    private fun createTrustManager(keyStore: KeyStore): X509TrustManager {
        val trustManagerFactory = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm())
        trustManagerFactory.init(keyStore)
        return trustManagerFactory.trustManagers[0] as X509TrustManager
    }
}
